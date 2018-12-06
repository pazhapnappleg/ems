import * as crossfilter from 'crossfilter';
import * as d3 from 'd3';
import * as dc from 'dc';
import { Student } from './models/BackendModels';
import { AdmissionConstants } from './utils/AdmissionConstants';
//import * as d3 from 'd3';
//import doT, { RenderFunction } from 'dot';
//import { DataListChart } from '../charts/DataListChart';
import { AdmissionData } from './models/AdmissionData';
/* possible filters
"batch_id": "3",
		"college_id": "1",
		"dept_id": "53",
		"gender": "Male",
		"community_id": "9",
		"category_id": "1",
        "reserv_quota_id": "", //
*/        
export class AdmissionController{
    
    private admissionData: AdmissionData;
    //cross filter, dimensions, groups
    private cf:crossfilter.Crossfilter<Student>;
    private dimsMap:Map<string, crossfilter.Dimension<Student, number>>;
    //Chart components in admission module
    //private genderChart:dc.PieChart;
    private pieSize = {"width":200,"height":200,"innerRadius":20,"slicesCap":4};
    private genderDimension:crossfilter.Dimension<Student, number>;
    private genderGroup: crossfilter.Group<Student, crossfilter.NaturallyOrderedValue, crossfilter.NaturallyOrderedValue>;
    private communityDimension:crossfilter.Dimension<Student, number>;
    private communityGroup: crossfilter.Group<Student, crossfilter.NaturallyOrderedValue, crossfilter.NaturallyOrderedValue>;

    constructor(admissionData: AdmissionData){
        this.admissionData = admissionData;
        this.dimsMap = new Map();
        console.log("AdmissionController initialized "+this.admissionData.dataLoaded);
    }

    public intialize(records:Student[]){
        this.cf = crossfilter<Student>(records);
        this.createDimentions();
        this.createGroups();
        this.createCharts();
        this.renderCharts();
    }
    private createGenderChart(){
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
    }
    private createCommunityChart(){
        //this.communityChart = 
        dc.barChart("#community-chart")
            .width(300)
            .height(this.pieSize.height)
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
    }
    private createDataTable(){
        //Defaulted to sorting by community, should be made dynamic
        dc.dataTable("#data-table")
            .width(300)
            .height(480)
            .dimension(this.dimsMap.get(AdmissionConstants.dims.community.field))
            .group((record) => record.co)
            .size(50)
            .showGroups(false)
            .columns([
                { label: "Gender", format: (d) => d.g },
                { label: "Community", format: (d) => d.co },
                { label: "Name", format: (d) => d.sn }
            ])
            .sortBy((record) => record.co)
            .order(d3.ascending);
    }
    private createCharts(){
        this.createGenderChart();
        this.createCommunityChart();
        this.createDataTable();
    }
    private createGroups(){
        this.genderGroup = this.genderDimension.group().reduceSum((record) => record.g);
        this.communityGroup = this.communityDimension.group().reduceSum((record) => record.co);
    }
    private createDimentions(){
        this.genderDimension = this.cf.dimension((record) => record.g);
        this.communityDimension = this.cf.dimension((record) => record.co);
        this.dimsMap.set(AdmissionConstants.dims.gender.field, this.genderDimension);
        this.dimsMap.set(AdmissionConstants.dims.community.field, this.communityDimension);
    }
    private renderCharts(): void{
        dc.renderAll();
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