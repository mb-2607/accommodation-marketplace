import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Reservacomponent } from "./reservacomponent";

describe("Reservacomponent", () => {
  let component: Reservacomponent;
  let fixture: ComponentFixture<Reservacomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Reservacomponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Reservacomponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
