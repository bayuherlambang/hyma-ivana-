import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TabAdminPage } from './tab-admin.page';

describe('TabAdminPage', () => {
  let component: TabAdminPage;
  let fixture: ComponentFixture<TabAdminPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabAdminPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TabAdminPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
