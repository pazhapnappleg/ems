import { Record } from "../../base/models/BaseModels";

export interface Student extends Record{
    co: number;//communityId
    g: number;//gender
    sn: string;//studentName
}