import { AdmissionData } from "./models/AdmissionData";
import { DataFetcher } from "../common-utils/DataFetcher";
import { Student } from "./models/BackendModels";
import { AdmissionController } from "./AdmissionController";

export class AdmissionApp{

    private admissionData: AdmissionData;
    private admissionController: AdmissionController;

    constructor(){
        this.admissionData = new AdmissionData();
        this.admissionController = new AdmissionController(this.admissionData);
        console.log("Admission App Initialized");
    }

    public intialize():void{
        //TODO apply logic to fetch offline or online data
        this.loadData();
    }

    public destroy():void{
        this.admissionData = null;
    }
    private loadData():void{
        DataFetcher.retrieveData("/data/StudentDetailsUI.json").then( (data) => {
            this.admissionController.intialize(<Student[]> data);
        });
    }
}