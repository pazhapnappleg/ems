
export class AdmissionData{
    private _dataLoaded:boolean;

    public get dataLoaded():boolean{
        return this._dataLoaded;
    }
    public set dataLoaded(dataLoaded:boolean){
        this._dataLoaded = dataLoaded;
    }
}