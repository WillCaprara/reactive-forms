import { Injectable } from "@angular/core";
import { Http, Response, URLSearchParams } from "@angular/http";
import { Observable } from "rxjs";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Item, Product } from "../models/product.interface";

@Injectable()
export class StockInventoryService {
    constructor(private http: Http) { }

    getCartItems(): Observable<Item[]> {
        return this.http
            .get('/api/cart')
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json));
    }

    getProducts(): Observable<Product[]> {
        return this.http
            .get('/api/products')
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json));
    }

    checkBranchId(id: string): Observable<boolean> {
        let search = new URLSearchParams();
        search.set('id', id);
        return this.http
                .get('/api/branches', { search })
                .map((response: Response) => response.json())
                //We're going to check wether we have a response back. If it doesn't exits, then our response.length will be an empty array.
                .map((response: any[]) => !!response.length)
                .catch((error: any) => Observable.throw(error.json()));
    }
}