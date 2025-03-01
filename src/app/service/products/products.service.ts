import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Product} from '../../models/product.model';


@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  public endpoint = 'http://localhost:3000/products'

  constructor(public http: HttpClient) {
  }

  public createProduct(Product: Product): Observable<Product> {
    return this.http.post<Product>(this.endpoint, Product)
  }

  public getProducts(): Observable<Product> {
    return this.http.get<Product>(this.endpoint)
  }

  public getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.endpoint}/${id}`)
  }

  public updateProduct(Product: Product, id: string): Observable<Product> {
    return this.http.patch<Product>(`${this.endpoint}/${id}`, Product)
  }

  public deleteProduct(id: string): Observable<Product> {
    return this.http.delete<Product>(`${this.endpoint}/${id}`)
  }

}
