import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OrderShowPage } from './order-show.page';

describe('OrderShowPage', () => {
  let component: OrderShowPage;
  let fixture: ComponentFixture<OrderShowPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderShowPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OrderShowPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
