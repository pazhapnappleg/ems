import { ListData } from "../../base/models/BaseModels";

export interface Student extends ListData{
    co: number;//communityId
    g: number;//gender
    sn: string;//studentName
}