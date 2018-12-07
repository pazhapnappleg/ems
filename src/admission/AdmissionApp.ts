import { AdmissionData } from "./models/AdmissionData";
//import { DataFetcher } from "../common-utils/DataFetcher";
//import { Student } from "./models/BackendModels";
import { AdmissionController } from "./AdmissionController";
import * as d3 from "d3";

export class AdmissionApp{

    private admissionData: AdmissionData; //Global Data for admission model, it could be a part whole app global data in future
    private admissionController: AdmissionController; // Controller for the charts only, interactions & data handling could be another

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
    private loadData(): void{
        d3.csv("/data/StudentDetailsMatrix.csv").then((data) => {
            let students:any[][] = [];
            for (var i = 0; i < data.length; i++) {
                let y:any[] = [];
                y.push(+data[i].batchId);
                y.push(+data[i].collegeId);
                y.push(+data[i].deptId);
                y.push(+data[i].gender);
                y.push(+data[i].communityId);
                y.push(+data[i].categoryId);
                y.push(+data[i].paymentMode);
                y.push(data[i].reservationQuotaId);
                y.push(+data[i].appFeeId);
                y.push(+data[i].appFormNumber);
                y.push(data[i].appSalesDate);
                y.push(data[i].studentName);
                students.push(y);
            }
            this.admissionController.intialize(students);
        });
    }
    /*
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
    
    private loadData():void{
        DataFetcher.retrieveCsv("/data/StudentDetailsMatrix.csv").then( (csv: DSVParsedArray<DSVRowString>) => {
            let data:string[][];
            let i:number = 0;
            csv.map(() => {
                data
            })
            this.admissionController.intialize(data);
        });
    }
    */
}