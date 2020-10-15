import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ValidasiheadsetPage } from './validasiheadset.page';

describe('ValidasiheadsetPage', () => {
  let component: ValidasiheadsetPage;
  let fixture: ComponentFixture<ValidasiheadsetPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidasiheadsetPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ValidasiheadsetPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
