import * as d3 from 'd3';

export abstract class BaseChart{    
    protected chartElement;

    constructor(readonly listDiv: string, ){
        this.chartElement = d3.select("#"+listDiv);
    }

    public abstract render():void;
}