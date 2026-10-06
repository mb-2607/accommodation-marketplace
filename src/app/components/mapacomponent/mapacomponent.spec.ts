import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Mapacomponent } from './mapacomponent';

describe('Mapacomponent', () => {
  let component: Mapacomponent;
  let fixture: ComponentFixture<Mapacomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Mapacomponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Mapacomponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
