import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ProductEditComponent} from './product-edit.component';

describe('ProductCardsComponent', () => {
  let component: ProductEditComponent;
  let fixture: ComponentFixture<ProductEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductEditComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ProductEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
