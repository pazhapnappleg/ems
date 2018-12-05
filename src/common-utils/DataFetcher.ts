export class DataFetcher{
     
    public static retrieveData(url:string){
        return fetch(url)
        .then( (response) => {return response.json(); }) 
        .catch(err => {
            console.error(err);
        });
    }
}
