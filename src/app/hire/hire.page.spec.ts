import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HirePage } from './hire.page';

describe('HirePage', () => {
  let component: HirePage;
  let fixture: ComponentFixture<HirePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HirePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HirePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
