import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Iniciocomponent } from './iniciocomponent';

describe('Iniciocomponent', () => {
  let component: Iniciocomponent;
  let fixture: ComponentFixture<Iniciocomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Iniciocomponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Iniciocomponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
