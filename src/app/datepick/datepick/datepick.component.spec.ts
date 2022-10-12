import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DatepickComponent } from './datepick.component';

describe('DatepickComponent', () => {
  let component: DatepickComponent;
  let fixture: ComponentFixture<DatepickComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatepickComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DatepickComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
