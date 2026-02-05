import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {Product, ProductResponse} from '../../models/product.model';
import {endpoint} from '../../constants/constant';


@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private readonly productsSubject = new BehaviorSubject<ProductResponse[]>([]);
  public readonly products$ = this.productsSubject.asObservable();

  constructor(public http: HttpClient) {
    this.refreshProducts();
  }

  public createProduct(Product: FormData): Observable<ProductResponse> {
    return this.http.post<ProductResponse>(`${endpoint}/products`, Product).pipe(
      tap(() => this.refreshProducts())
    )
  }

  public getProducts(): Observable<ProductResponse[]> {
    return this.http.get<ProductResponse[]>(`${endpoint}/products`)
  }

  public getProductById(id: string): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(`${endpoint}/products/${id}`)
  }

  public updateProduct(Product: FormData, id: string): Observable<ProductResponse> {
    return this.http.put<ProductResponse>(`${endpoint}/products/${id}`, Product).pipe(
      tap(() => this.refreshProducts())
    )
  }

  public deleteProduct(product: Product, id: string): Observable<ProductResponse> {
    return this.http.delete<ProductResponse>(`${endpoint}/products/${id}`, {body: product}).pipe(
      tap(() => this.refreshProducts())
    )
  }

  public refreshProducts(): void {
    this.http.get<ProductResponse[]>(`${endpoint}/products`).subscribe({
      next: (products) => this.productsSubject.next(products),
      error: () => undefined,
    });
  }

}
