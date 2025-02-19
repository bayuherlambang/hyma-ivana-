import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DashboardUserPage } from './dashboard-user.page';

describe('DashboardUserPage', () => {
  let component: DashboardUserPage;
  let fixture: ComponentFixture<DashboardUserPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardUserPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardUserPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
