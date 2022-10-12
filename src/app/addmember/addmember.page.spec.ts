import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddmemberPage } from './addmember.page';

describe('AddmemberPage', () => {
  let component: AddmemberPage;
  let fixture: ComponentFixture<AddmemberPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddmemberPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddmemberPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
