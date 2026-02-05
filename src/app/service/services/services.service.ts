import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {endpoint} from '../../constants/constant';
import {
  CreateServiceCategoryPayload,
  SalonService,
  ServiceCategory,
  ServicePayload
} from '../../models/service.model';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {
  constructor(private readonly http: HttpClient) {
  }

  public createCategory(payload: CreateServiceCategoryPayload): Observable<ServiceCategory> {
    return this.http.post<ServiceCategory>(`${endpoint}/service-categories`, payload);
  }

  public getCategories(): Observable<ServiceCategory[]> {
    return this.http.get<ServiceCategory[]>(`${endpoint}/service-categories`);
  }

  public createService(payload: ServicePayload): Observable<SalonService> {
    return this.http.post<SalonService>(`${endpoint}/services`, payload);
  }

  public getServices(): Observable<SalonService[]> {
    return this.http.get<SalonService[]>(`${endpoint}/services`);
  }

  public updateService(id: string, payload: ServicePayload): Observable<SalonService> {
    return this.http.put<SalonService>(`${endpoint}/services/${id}`, payload);
  }

  public deleteService(id: string): Observable<SalonService> {
    return this.http.delete<SalonService>(`${endpoint}/services/${id}`);
  }

  public updateCategory(id: string, payload: CreateServiceCategoryPayload): Observable<ServiceCategory> {
    return this.http.put<ServiceCategory>(`${endpoint}/service-categories/${id}`, payload);
  }

  public deleteCategory(id: string): Observable<ServiceCategory> {
    return this.http.delete<ServiceCategory>(`${endpoint}/service-categories/${id}`);
  }
}
