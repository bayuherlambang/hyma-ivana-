import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DashboardAdminPage } from './dashboard-admin.page';

describe('DashboardAdminPage', () => {
  let component: DashboardAdminPage;
  let fixture: ComponentFixture<DashboardAdminPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardAdminPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardAdminPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
