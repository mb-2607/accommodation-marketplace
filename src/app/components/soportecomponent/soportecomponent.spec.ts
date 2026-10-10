import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Soportecomponent } from "./soportecomponent";

describe("Soportecomponent", () => {
  let component: Soportecomponent;
  let fixture: ComponentFixture<Soportecomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Soportecomponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Soportecomponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
