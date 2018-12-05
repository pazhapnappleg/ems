import * as d3 from 'd3';
import { RenderFunction } from 'dot';
import { DimParam } from '../common-utils/Settings';
import { ListData } from '../base/models/BaseModels';
import crossfilter from 'crossfilter';
import { ChartInterface } from './ChartInterface';

export class DataListChart<T extends ListData> implements ChartInterface{
    private listElement;
    private currentPage: number = 1;
    private perPage: number = 10;
    private dim: DimParam;

    constructor(readonly listDiv: string, readonly template: RenderFunction,
        readonly dimsMap:Map<string, crossfilter.Dimension<T, number>>, dim: DimParam){
        this.dim = dim;
        this.listElement = d3.select("#"+listDiv);
    }

    public render() {
        let list = this.listElement.selectAll(".listElement").data(this.getList(), (d: T) => d.id);
        list.enter().append("div").attr("class", "listElement").html((d: T) => this.template(d));
        list.exit().remove();
    }

    private getList(): T[]{   
        let dim: crossfilter.Dimension<T, number> = this.dimsMap.get(this.dim.field);
        if (this.dim.top) {
            return dim.top(this.perPage, (this.currentPage - 1) * this.perPage);
        }
        return dim.bottom(this.perPage, (this.currentPage - 1) * this.perPage);
    }
}