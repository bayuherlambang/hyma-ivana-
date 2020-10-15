import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OrderPreparePage } from './order-prepare.page';

describe('OrderPreparePage', () => {
  let component: OrderPreparePage;
  let fixture: ComponentFixture<OrderPreparePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderPreparePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OrderPreparePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
