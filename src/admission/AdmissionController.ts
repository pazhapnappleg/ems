import * as crossfilter from 'crossfilter';
import * as d3 from 'd3';
import * as dc from 'dc';
import { A } from './models/BackendModels';
import { AdmissionConstants } from './utils/AdmissionConstants';
//import * as d3 from 'd3';
//import doT, { RenderFunction } from 'dot';
//import { DataListChart } from '../charts/DataListChart';
import { AdmissionData } from './models/AdmissionData';
/* possible filters
    "batch_id": "3",
    "college_id": "1",
    "dept_id": "53",
    "gender": "Male", //added
    "community_id": "9", //added
    "category_id": "1", 
    "reserv_quota_id": "", //
*/        
export class AdmissionController{
    public static batchId:number = 0;
	public static collegeId:number = 1;
	public static deptId:number = 2;
	public static gender:number = 3;
	public static communityId:number = 4;
	public static categoryId:number = 5;
	public static paymentMode:number = 6;
	public static reservationQuotaId:number = 7;
	public static appFeeId:number = 8;
	public static appFormNumber:number = 9;
	public static appSalesDate:number =  10;
    public static studentName:number = 11;
    
    private admissionData: AdmissionData;
    //cross filter, dimensions, groups
    private cf:crossfilter.Crossfilter<any[]>;
    private dimsMap:Map<string, crossfilter.Dimension<any[], number>>;
    //Chart components in admission module
    //private genderChart:dc.PieChart;
    private pieSize = {"width":150,"height":150,"innerRadius":20};
    private barSize = {"width":300,"height":200};
    private genderDimension:crossfilter.Dimension<any[], number>;
    private genderGroup: crossfilter.Group<any[], crossfilter.NaturallyOrderedValue, crossfilter.NaturallyOrderedValue>;
    private genderFn = (d) => d[A.gender];
    private communityDimension:crossfilter.Dimension<any[], number>;
    private communityGroup: crossfilter.Group<any[], crossfilter.NaturallyOrderedValue, crossfilter.NaturallyOrderedValue>;
    private communityFn = (d) => d[A.communityId];
    private collegeDimension:crossfilter.Dimension<any[], number>;
    private collegeGroup: crossfilter.Group<any[], crossfilter.NaturallyOrderedValue, crossfilter.NaturallyOrderedValue>;
    private collegeFn = (d) => d[A.collegeId];
    private deptDimension:crossfilter.Dimension<any[], number>;
    private deptGroup: crossfilter.Group<any[], crossfilter.NaturallyOrderedValue, crossfilter.NaturallyOrderedValue>;
    private deptFn = (d) => d[A.deptId];

    constructor(admissionData: AdmissionData){
        this.admissionData = admissionData;
        this.dimsMap = new Map();
        console.log("AdmissionController initialized "+this.admissionData.dataLoaded);
    }

    public intialize(records:any[]){
        this.cf = crossfilter<any[]>(records);
        this.createDimentions();
        this.createGroups();
        this.createCharts();
        this.renderCharts();
    }
    //pie charts -> gender, college
    private createPieCharts(){
        //this.genderChart = 
        dc.pieChart("#gender-chart")
            .width(this.pieSize.width)
            .height(this.pieSize.height)
            .transitionDuration(500)
            .innerRadius(this.pieSize.innerRadius)
            .dimension(this.genderDimension)
            .group(this.genderGroup)
            //.legend(dc.legend())
            .on('pretransition', (chart) => {
                chart.selectAll('text.pie-slice').text((d) => d.data.key + ' - ' + d.data.value)
            }).minAngleForLabel(10)            
            .turnOnControls();
            //return d.data.key + ' ' + dc.utils.printSingleValue((d.endAngle - d.startAngle) / (2*Math.PI) * 100) + '%';
        
        dc.pieChart("#college-chart")
            .width(this.pieSize.width)
            .height(this.pieSize.height)
            .transitionDuration(500)
            .innerRadius(this.pieSize.innerRadius)
            .dimension(this.collegeDimension)
            .group(this.collegeGroup)
            //.legend(dc.legend())
            .on('pretransition', (chart) => {
                chart.selectAll('text.pie-slice').text((d) => d.data.key + ' - ' + d.data.value)
            }).minAngleForLabel(10)            
            .turnOnControls();
    }
    //bar charts -> community, dept
    private createCommunityChart(){
        //this.communityChart = 
        dc.barChart("#community-chart")
            .width(this.barSize.width)
            .height(this.barSize.height)
            .transitionDuration(500)
            .dimension(this.communityDimension)
            .group(this.communityGroup)
            //.legend(dc.legend())
            // workaround for #703: not enough data is accessible through .label() to display percentages
            .on('pretransition', (chart) => {
                chart.selectAll('text.pie-slice').text((d) => d.data.key + ' - ' + d.data.value)
            })         
            .x(d3.scaleBand())
            .xUnits(dc.units.ordinal)
            .xAxisLabel('Community')
            .yAxisLabel('Count')
            .turnOnControls();
        dc.barChart("#dept-chart")
            .width(500)
            .height(this.barSize.height)
            .transitionDuration(500)
            .dimension(this.deptDimension)
            .group(this.deptGroup)
            //.legend(dc.legend())
            // workaround for #703: not enough data is accessible through .label() to display percentages
            .on('pretransition', (chart) => {
                chart.selectAll('text.pie-slice').text((d) => d.data.key + ' - ' + d.data.value)
            })         
            .x(d3.scaleBand())
            .xUnits(dc.units.ordinal)
            .xAxisLabel('Dept')
            .yAxisLabel('Count')
            .turnOnControls();
    }
    
    private createDataTable(){
        //Defaulted to sorting by community, should be made dynamic
        dc.dataTable("#data-table")
            .width(500)
            .height(480)
            .dimension(this.dimsMap.get(AdmissionConstants.dims.community.field))
            .group(this.communityFn)
            .size(50)
            .showGroups(false)
            .columns([
                { label: "Gender", format: this.genderFn },
                { label: "Community", format: this.communityFn},
                { label: "Name", format: (d) => d[A.studentName] }
            ])
            .sortBy(this.communityFn)
            .order(d3.ascending);
    }
    private createCharts(){
        this.createPieCharts();
        this.createCommunityChart();
        this.createDataTable();
    }
    private createDimentions(){
        this.genderDimension = this.cf.dimension(this.genderFn);
        this.communityDimension = this.cf.dimension(this.communityFn);
        this.collegeDimension = this.cf.dimension(this.collegeFn);
        this.deptDimension = this.cf.dimension(this.deptFn);
        this.dimsMap.set(AdmissionConstants.dims.gender.field, this.genderDimension);
        this.dimsMap.set(AdmissionConstants.dims.community.field, this.communityDimension);
    }
    private renderCharts(): void{
        dc.renderAll();
    }
    private createGroups(){
        this.genderGroup = this.genderDimension.group().reduceCount();
        this.communityGroup = this.communityDimension.group().reduceCount();
        this.deptGroup = this.deptDimension.group().reduceCount();
        this.collegeGroup = this.collegeDimension.group().reduceCount();
    }
    /*
    private createTemplate(): RenderFunction {
        return doT.template("<div class='row'>"+
            "<div class='col-5'> Gender: {{=it.g}}</div>" +
            "<div class='col-2'> Community: {{=it.co}}</div>"+
            "<div class='col-5'> {{=it.sn}}</div>"+
            "</div>");
    }
    */
}