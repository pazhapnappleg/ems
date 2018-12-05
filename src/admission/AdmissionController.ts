import * as crossfilter from 'crossfilter';
import { Student } from './models/BackendModels';
import { AdmissionConstants } from './utils/AdmissionConstants';
//import * as d3 from 'd3';
import doT, { RenderFunction } from 'dot';
import { DataListChart } from '../charts/DataListChart';
import { AdmissionData } from './models/AdmissionData';

export class AdmissionController{
    
    private cf:crossfilter.Crossfilter<Student>;
    private dimsMap:Map<string, crossfilter.Dimension<Student, number>>;
    private dataListController:DataListChart<Student>;
    private admissionData: AdmissionData;

    constructor(admissionData: AdmissionData){
        this.admissionData = admissionData;
        this.dimsMap = new Map();
        console.log("AdmissionController initialized "+this.admissionData.dataLoaded);
    }

    public intialize(records:Student[]){
        try{
            this.cf = crossfilter<Student>(records);
            this.createDimentions();
            this.createChartControllers();
            this.renderCharts();
        }catch(e){
            console.error(e);
        }
    }

    private renderCharts(): void{
        this.dataListController.render();
    }

    private createChartControllers(){
        this.dataListController = new DataListChart("students", this.createTemplate(), 
                                    this.dimsMap, AdmissionConstants.dims.gender);
    }
    private createDimentions(){
        this.dimsMap.set(AdmissionConstants.dims.gender.field, this.cf.dimension((d) => d.g));
        this.dimsMap.set(AdmissionConstants.dims.community.field, this.cf.dimension((d) => d.co));
    }

    private createTemplate(): RenderFunction {
        return doT.template("<div class='row'>"+
            "<div class='col-5'> Gender: {{=it.g}}</div>" +
            "<div class='col-2'> Community: {{=it.co}}</div>"+
            "<div class='col-5'> {{=it.sn}}</div>"+
            "</div>");
    }
}