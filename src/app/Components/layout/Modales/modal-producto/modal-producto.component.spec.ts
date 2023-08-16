import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalProductoComponent } from './modal-producto.component';

describe('ModalProductoComponent', () => {
  let component: ModalProductoComponent;
  let fixture: ComponentFixture<ModalProductoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalProductoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
