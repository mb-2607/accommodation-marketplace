import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Cotizacioncomponent } from "./cotizacioncomponent";

describe("Cotizacioncomponent", () => {
  let component: Cotizacioncomponent;
  let fixture: ComponentFixture<Cotizacioncomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Cotizacioncomponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Cotizacioncomponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
