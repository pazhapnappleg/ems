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
    private resetElements:HTMLCollectionOf<Element>;
    private nextElement: HTMLElement;
    private lastElement: HTMLElement;
    private allCharts:Map<string, dc.BaseMixin<any>>;
    private chartTags ={gender:"gender", college:"college", community:"community", dept:"dept"}
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
    private ofs = 0;
    private pag = 17;    // use odd page size to show the effect better
    private dataTable = "data-table";

    constructor(admissionData: AdmissionData){
        this.admissionData = admissionData;
        this.allCharts = new Map();
        this.dimsMap = new Map();
        console.log("AdmissionController initialized "+this.admissionData.dataLoaded);
    }

    public intialize(records:any[]){
        this.cf = crossfilter<any[]>(records);
        this.createDimentions();
        this.createGroups();
        this.addResetEventListeners();
        this.createCharts();
        this.renderCharts();
    }
    private addResetEventListeners():void{ 
        this.resetElements = document.getElementsByClassName("reset");
        for(var i=0;i<this.resetElements.length;i++){
            this.resetElements[i].addEventListener('click', 
                (e)=>{this.allCharts.get(e.srcElement.parentElement.id).filterAll();dc.redrawAll();e.preventDefault();}, false);
        }
        this.nextElement = document.getElementById("next");
        this.nextElement.addEventListener('click', (e)=>{this.next(this.allCharts.get(this.dataTable));e.preventDefault();},false);
        this.lastElement = document.getElementById("last");
        this.lastElement.addEventListener('click', (e)=>{this.last(this.allCharts.get(this.dataTable));e.preventDefault();},false);
    }
    
    //pie charts -> gender, college
    private createPieCharts(){
        let chartTag = this.chartTags.gender;
        let chart = dc.pieChart("#"+chartTag)
        this.allCharts.set(chartTag, chart);
        chart.width(this.pieSize.width)
            .height(this.pieSize.height)
            .transitionDuration(500)
            .innerRadius(this.pieSize.innerRadius)
            .dimension(this.genderDimension)
            .group(this.genderGroup)
            //.legend(dc.legend())
            .label((d) => {
                return d.value +" "+((d.key == 1)?"Male":"Female");
            } );
            //return d.data.key + ' ' + dc.utils.printSingleValue((d.endAngle - d.startAngle) / (2*Math.PI) * 100) + '%';
        
        chartTag = this.chartTags.college;
        chart = dc.pieChart("#"+chartTag)
        this.allCharts.set(chartTag, chart);
        chart.width(this.pieSize.width)
            .height(this.pieSize.height)
            .transitionDuration(500)
            .innerRadius(this.pieSize.innerRadius)
            .dimension(this.collegeDimension)
            .group(this.collegeGroup)
            //.legend(dc.legend())
            .on('pretransition', (chart) => {
                chart.selectAll('text.pie-slice').text((d) => d.data.key + ' - ' + d.data.value)
            })
            .minAngleForLabel(10);
    }
    //bar charts -> community
    private createBarCharts(){
        /*
        let chartTag = this.chartTags.community;
        let chart = dc.barChart("#"+chartTag)
        this.allCharts.set(chartTag, chart);
        chart
            .width(this.barSize.width)
            .height(this.barSize.height)
            .transitionDuration(500)
            .dimension(this.communityDimension)
            .group(this.communityGroup)
            .on('pretransition', (chart) => {
                chart.selectAll('text.pie-slice').text((d) => d.data.key + ' - ' + d.data.value)
            })         
            .x(d3.scaleBand())
            .xUnits(dc.units.ordinal)
            .xAxisLabel('Community')
            .yAxisLabel('Count');
        */
    }
    //row charts -> community
    private createRowCharts(){
        let chartTag = this.chartTags.community;
        let chart = dc.rowChart("#"+chartTag)
        this.allCharts.set(chartTag, chart);
        chart
            .width(this.barSize.width)
            .height(this.barSize.height)
            .transitionDuration(500)
            .dimension(this.communityDimension)
            .group(this.communityGroup)
            .legend(dc.legend())
            .on('pretransition', (chart) => {
                chart.selectAll('text.pie-slice').text((d) => d.data.key + ' - ' + d.data.value)
            })  
            .elasticX(true)
            .xAxis().ticks(8);
            
        chartTag = this.chartTags.dept;
        chart = dc.rowChart("#"+chartTag)
        this.allCharts.set(chartTag, chart);
        chart.width(this.barSize.width)
            .height(500)
            .transitionDuration(500)
            .dimension(this.deptDimension)
            .group(this.deptGroup)
            //.legend(dc.legend())
            // workaround for #703: not enough data is accessible through .label() to display percentages
            .on('pretransition', (chart) => {
                chart.selectAll('text.pie-slice').text((d) => d.data.key + ' - ' + d.data.value)
            })  
            .elasticX(true)
            .xAxis().ticks(8);
    }
    
    private createDataTable(){
        let chart = dc.dataTable("#"+this.dataTable);
        this.allCharts.set(this.dataTable, chart);
        chart.width(500)
            .height(480)
            .dimension(this.dimsMap.get(AdmissionConstants.dims.community.field))
            .group(this.communityFn)
            .size(Infinity)
            .showGroups(false)
            .columns([
                { label: "Gender", format: this.genderFn },
                { label: "Community", format: this.communityFn},
                { label: "Name", format: (d) => d[A.studentName] }
            ])
            .sortBy(this.communityFn)
            .order(d3.ascending)
            .on('preRender', () => this.updateOffset(chart))
            .on('preRedraw', () => this.updateOffset(chart))
            .on('pretransition', () => this.display());
    }
    private updateOffset(chart) {
        let totFilteredRecs: any = this.cf.groupAll().value();
        this.ofs = this.ofs >= totFilteredRecs ? Math.floor((totFilteredRecs - 1) / this.pag) * this.pag : this.ofs;
        this.ofs = this.ofs < 0 ? 0 : this.ofs;

        chart.beginSlice(this.ofs);
        chart.endSlice(this.ofs+this.pag);
    }
    private display() {
        let totFilteredRecs: any = this.cf.groupAll().value();
        let end = this.ofs + this.pag > totFilteredRecs ? totFilteredRecs : this.ofs + this.pag;
        d3.select('#begin')
            .text(end === 0? this.ofs : this.ofs + 1);
        d3.select('#end')
            .text(end);
        d3.select('#last')
            .attr('disabled', this.ofs-this.pag<0 ? 'true' : null);
        d3.select('#next')
            .attr('disabled', this.ofs+this.pag>=totFilteredRecs ? 'true' : null);
        d3.select('#size').text(totFilteredRecs);
        if(totFilteredRecs != this.cf.size()){
          d3.select('#totalsize').text("(filtered Total: " + this.cf.size() + " )");
        }else{
          d3.select('#totalsize').text('');
        }
    }
    private next(chart) {
        this.ofs += this.pag;
        this.updateOffset(chart);
        chart.redraw();
    }
    private last(chart) {
        this.ofs -= this.pag;
        this.updateOffset(chart);
        chart.redraw();
    }
    private createCharts(){
        this.createPieCharts();
        this.createBarCharts();
        this.createRowCharts();
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
        this.genderGroup = this.genderDimension.group();
        this.communityGroup = this.communityDimension.group();
        this.deptGroup = this.deptDimension.group();
        this.collegeGroup = this.collegeDimension.group();
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