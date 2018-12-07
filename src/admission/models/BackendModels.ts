import { Record } from "../../base/models/BaseModels";

export interface Student extends Record{
    
}
export class A{
    public static batchId:number = 0;
	public static collegeId:number = 1;//pie
	public static deptId:number = 2;//bar
	public static gender:number = 3;//pie
	public static communityId:number = 4;//bar
	public static categoryId:number = 5;
	public static paymentMode:number = 6;
	public static reservationQuotaId:number = 7;
	public static appFeeId:number = 8;
	public static appFormNumber:number = 9;
	public static appSalesDate:number =  10;
    public static studentName:number = 11;
}