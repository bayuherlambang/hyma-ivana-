import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BarangKeluarPage } from './barang-keluar.page';

describe('BarangKeluarPage', () => {
  let component: BarangKeluarPage;
  let fixture: ComponentFixture<BarangKeluarPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BarangKeluarPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BarangKeluarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
