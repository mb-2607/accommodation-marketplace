import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Confirmarreservacomponent } from "./confirmarreservacomponent";

describe("Confirmarreservacomponent", () => {
  let component: Confirmarreservacomponent;
  let fixture: ComponentFixture<Confirmarreservacomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Confirmarreservacomponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Confirmarreservacomponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
