import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MemberdetsPage } from './memberdets.page';

describe('MemberdetsPage', () => {
  let component: MemberdetsPage;
  let fixture: ComponentFixture<MemberdetsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemberdetsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MemberdetsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
