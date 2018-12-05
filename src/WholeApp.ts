import { AdmissionApp } from "./admission/AdmissionApp";

export class WholeApp{
    private admissionApp: AdmissionApp = null;

    constructor(){

    }

    public initializeAdmission(): void{
        this.admissionApp = (this.admissionApp != null)?this.admissionApp:new AdmissionApp();
        this.admissionApp.intialize();
    }

    public initialize():void{
        this.initializeAdmission();//do this code in admission tab click event
    }
}
console.log("App starting");
let wholeApp: WholeApp = new WholeApp();
wholeApp.initialize();