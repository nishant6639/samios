import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ProviderdetsPage } from './providerdets.page';

describe('ProviderdetsPage', () => {
  let component: ProviderdetsPage;
  let fixture: ComponentFixture<ProviderdetsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProviderdetsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ProviderdetsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
