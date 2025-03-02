import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Product} from '../../models/product.model';
import {endpoint} from '../../constants/constant';


@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  constructor(public http: HttpClient) {
  }

  public createProduct(Product: any): Observable<Product> {
    return this.http.post<Product>(`${endpoint}/products`, Product)
  }

  public getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${endpoint}/products`)
  }

  public getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${endpoint}/products/${id}`)
  }

  public updateProduct(Product: Product, id: string): Observable<Product> {
    return this.http.patch<Product>(`${endpoint}/products/${id}`, Product)
  }

  public deleteProduct(id: string): Observable<Product> {
    return this.http.delete<Product>(`${endpoint}/products/${id}`)
  }

}
