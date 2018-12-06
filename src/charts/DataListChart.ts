import crossfilter from 'crossfilter';
import { RenderFunction } from 'dot';
import { DimParam } from '../common-utils/Settings';
import { Record } from '../base/models/BaseModels';
import { BaseChart } from './BaseChart';

export class DataListChart<T extends Record> extends BaseChart{
    private currentPage: number = 1;
    private perPage: number = 10;
    private dimParam: DimParam;

    constructor(readonly listDiv: string, readonly template: RenderFunction,
        readonly dimsMap:Map<string, crossfilter.Dimension<T, number>>, dimParam: DimParam){
        super(listDiv);
        this.dimParam = dimParam;
    }

    public render() {
        let list = super.chartElement.selectAll(".listElement").data(this.getList(), (d: T) => d.id);
        list.enter().append("div").attr("class", "listElement").html((d: T) => this.template(d));
        list.exit().remove();
    }

    private getList(): T[]{   
        let dim: crossfilter.Dimension<T, number> = this.dimsMap.get(this.dimParam.field);
        if (this.dimParam.top) {
            return dim.top(this.perPage, (this.currentPage - 1) * this.perPage);
        }
        return dim.bottom(this.perPage, (this.currentPage - 1) * this.perPage);
    }
}