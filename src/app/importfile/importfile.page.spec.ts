import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ImportfilePage } from './importfile.page';

describe('ImportfilePage', () => {
  let component: ImportfilePage;
  let fixture: ComponentFixture<ImportfilePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportfilePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ImportfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
