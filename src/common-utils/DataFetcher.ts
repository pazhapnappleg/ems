import * as d3 from 'd3';

export class DataFetcher{
     
    public static retrieveCsv(url:string){
        return fetch(url)
        .then( (response) => {return response.text(); }) 
        .then((text) => {return d3.csvParse(text)})
        .catch(err => {
            console.error(err);
        });
    }
    public static retrieveJson(url:string){
        return fetch(url)
        .then( (response) => {return response.json(); }) 
        .catch(err => {
            console.error(err);
        });
    }
}
