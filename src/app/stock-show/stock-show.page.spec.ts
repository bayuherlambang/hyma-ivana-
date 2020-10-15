import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StockShowPage } from './stock-show.page';

describe('StockShowPage', () => {
  let component: StockShowPage;
  let fixture: ComponentFixture<StockShowPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockShowPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StockShowPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
