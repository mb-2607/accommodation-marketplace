import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Filtercomponent } from "./filtercomponent";

describe("Filtercomponent", () => {
  let component: Filtercomponent;
  let fixture: ComponentFixture<Filtercomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Filtercomponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Filtercomponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
