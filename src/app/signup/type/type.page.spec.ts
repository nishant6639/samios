import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TypePage } from './type.page';

describe('TypePage', () => {
  let component: TypePage;
  let fixture: ComponentFixture<TypePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TypePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TypePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
