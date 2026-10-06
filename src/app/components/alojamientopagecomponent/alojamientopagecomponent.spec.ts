import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Alojamientopagecomponent } from "./alojamientopagecomponent";

describe("Alojamientopagecomponent", () => {
  let component: Alojamientopagecomponent;
  let fixture: ComponentFixture<Alojamientopagecomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Alojamientopagecomponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Alojamientopagecomponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
