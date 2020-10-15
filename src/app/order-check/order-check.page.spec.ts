import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OrderCheckPage } from './order-check.page';

describe('OrderCheckPage', () => {
  let component: OrderCheckPage;
  let fixture: ComponentFixture<OrderCheckPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderCheckPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OrderCheckPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
