import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LogPeminjamanPage } from './log-peminjaman.page';

describe('LogPeminjamanPage', () => {
  let component: LogPeminjamanPage;
  let fixture: ComponentFixture<LogPeminjamanPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogPeminjamanPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LogPeminjamanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
