import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StockOpnamePage } from './stock-opname.page';

describe('StockOpnamePage', () => {
  let component: StockOpnamePage;
  let fixture: ComponentFixture<StockOpnamePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockOpnamePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StockOpnamePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
