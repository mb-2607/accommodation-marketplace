import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Reservaitemcomponent } from "./reservaitemcomponent";

describe("Reservaitemcomponent", () => {
  let component: Reservaitemcomponent;
  let fixture: ComponentFixture<Reservaitemcomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Reservaitemcomponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Reservaitemcomponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
