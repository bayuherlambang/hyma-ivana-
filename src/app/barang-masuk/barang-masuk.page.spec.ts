import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BarangMasukPage } from './barang-masuk.page';

describe('BarangMasukPage', () => {
  let component: BarangMasukPage;
  let fixture: ComponentFixture<BarangMasukPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BarangMasukPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BarangMasukPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
