import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { IconComponent } from './icon.component';

describe('IconComponent', () => {
  let component: IconComponent;
  let fixture: ComponentFixture<IconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IconComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(IconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
