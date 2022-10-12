import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DpPage } from './dp.page';

describe('DpPage', () => {
  let component: DpPage;
  let fixture: ComponentFixture<DpPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DpPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DpPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
