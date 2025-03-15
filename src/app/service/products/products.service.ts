import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Product, ProductResponse} from '../../models/product.model';
import {endpoint} from '../../constants/constant';


@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  constructor(public http: HttpClient) {
  }

  public createProduct(Product: FormData): Observable<ProductResponse> {
    return this.http.post<ProductResponse>(`${endpoint}/products`, Product)
  }

  public getProducts(): Observable<ProductResponse[]> {
    return this.http.get<ProductResponse[]>(`${endpoint}/products`)
  }

  public getProductById(id: string): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(`${endpoint}/products/${id}`)
  }

  public updateProduct(Product: FormData, id: string): Observable<ProductResponse> {
    return this.http.put<ProductResponse>(`${endpoint}/products/${id}`, Product)
  }

  public deleteProduct(product: Product, id: string): Observable<ProductResponse> {
    return this.http.delete<ProductResponse>(`${endpoint}/products/${id}`, {body: product})
  }

}
