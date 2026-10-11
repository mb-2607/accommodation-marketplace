import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Privacidadcomponent } from "./privacidadcomponent";

describe("Privacidadcomponent", () => {
  let component: Privacidadcomponent;
  let fixture: ComponentFixture<Privacidadcomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Privacidadcomponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Privacidadcomponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
