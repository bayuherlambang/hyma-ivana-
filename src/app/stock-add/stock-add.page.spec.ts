import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StockAddPage } from './stock-add.page';

describe('StockAddPage', () => {
  let component: StockAddPage;
  let fixture: ComponentFixture<StockAddPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockAddPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StockAddPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
