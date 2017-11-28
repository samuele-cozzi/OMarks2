import { Injectable }   from '@angular/core';
import { Http, Headers }         from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {SettingsModel} from '../models/settingsModel';
import {OmarksSettingsProvider} from './settings';

@Injectable()
export class AlgoliaService {

    public index: string;
    public application_id: string;
    public api_key: string;

    private service_url: string;
    private headers: Headers;
    private settings: SettingsModel = new SettingsModel();

    constructor(private http: Http, settingsProvider: OmarksSettingsProvider) { 
        
        this.settings = settingsProvider.getSettings();
        this.index = this.settings.algolia.index;
        this.application_id = this.settings.algolia.applicationId;
        this.api_key = this.settings.algolia.apiKey;

        this.service_url = 'https://' + this.application_id + '.algolia.net/1/indexes/' + this.index;

        this.headers = new Headers({
            'Content-Type': 'application/json',
            'Accept': 'application/JSON',
            'X-Algolia-API-Key': this.api_key,
            'X-Algolia-Application-Id': this.application_id
        });
    }

    private handleError(error: any): Promise<any> {
        console.log('An error occurred', error);
        return Promise.reject(error.message || error);
    }

    public get_dashboard() : Promise<any> {
        
        let body = {
            "params": "query=1",
            "restrictSearchableAttributes":"favorite",
            "hitsPerPage": "50"
        }

        return this.http.post(this.service_url + "/query", body, {headers: this.headers})
            .toPromise()
            .then(response => response.json().hits)
            .catch(this.handleError);
    }

    public get_facets() : Promise<any> {
        
        return this.http.get(this.service_url + '?facets=*', {headers: this.headers})
               .toPromise()
               .then(response => {
                   var obj = response.json().facets;
                   var response_array = [];
                   for (var key in obj) {
                       if(key.endsWith('.tag'))
                       {
                        for (var key1 in obj[key]) {
                            response_array.push({
                                'key': key,
                                'value': key1
                            });
                            
                        }
                       }
                    }
                   return response_array;
               })
               .catch(this.handleError);
    }

    public get_filtered_facets(key: string, value: string, hitsPerPage: number = 20, page: number = 0 ) : Promise<any> {
        
        let body = {
            "facetFilters": key + ':' + value,
            "hitsPerPage":hitsPerPage,
            "page": page
        }


        return this.http.post(this.service_url + '/query', body ,{headers: this.headers})
               .toPromise()
               .then(response => response.json().hits)
               .catch(this.handleError);
    }

    public get_query(query: string, hitsPerPage: number = 20, page: number = 0 ) : Promise<any> {
        
        let body = {
            "query": query,
            "hitsPerPage":hitsPerPage,
            "page": page
        }

        return this.http.post(this.service_url + '/query', body, {headers: this.headers})
               .toPromise()
               .then(response => response.json().hits)
               .catch(this.handleError);
    }

    public save_item(item) : Promise<any> {
        
        return this.http.post(this.service_url, item, {headers: this.headers})
            .toPromise()
            .then(response => response.json().hits)
            .catch(this.handleError);
    }

    public delete_item(item) : Promise<any> {
        
        return this.http.delete(this.service_url + '/' + item.objectID, {headers: this.headers})
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

}