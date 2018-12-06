import * as crossfilter from 'crossfilter';
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
    //private dataListChart:DataListChart<Student>;
    //private genderChart:dc.PieChart;
    private genderDimension:crossfilter.Dimension<Student, number>;
    private genderGroup;

    constructor(admissionData: AdmissionData){
        this.admissionData = admissionData;
        this.dimsMap = new Map();
        console.log("AdmissionController initialized "+this.admissionData.dataLoaded);
    }

    public intialize(records:Student[]){
        try{
            //this.createChartControllers();
            this.cf = crossfilter<Student>(records);
            this.createDimentions();
            this.createGroups();
            this.createCharts();
            this.renderCharts();
        }catch(e){
            console.error(e);
        }
    }
    private createCharts(){
        //this.genderChart = 
        dc.pieChart("#gender-chart")
            .width(768)
            .height(480)
            .slicesCap(4)
            .innerRadius(100)
            .dimension(this.genderDimension)
            .group(this.genderGroup)
            .legend(dc.legend())
            // workaround for #703: not enough data is accessible through .label() to display percentages
            .on('pretransition', function(chart) {
                chart.selectAll('text.pie-slice').text(function(d) {
                    return d.data.key + ' ' + dc.utils.printSingleValue((d.endAngle - d.startAngle) / (2*Math.PI) * 100) + '%';
                })
            });
    }
    private renderCharts(): void{
        //this.dataListChart.render();
        dc.renderAll();
    }
    /*
    private createChartControllers(){
        this.dataListChart = new DataListChart("students", this.createTemplate(), 
                                    this.dimsMap, AdmissionConstants.dims.gender);
    }
    */
    private createGroups(){
        this.genderGroup = this.genderDimension.group().reduceSum((record) => record.g);
    }
    private createDimentions(){
        this.genderDimension = this.cf.dimension((record) => record.g);
        this.dimsMap.set(AdmissionConstants.dims.gender.field, this.genderDimension);
        this.dimsMap.set(AdmissionConstants.dims.community.field, this.cf.dimension((record) => record.co));
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