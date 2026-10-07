import { TestBed } from "@angular/core/testing";
import { Alojamientoservice } from "./alojamientoservice";

describe("Alojamientoservice", () => {
  let service: Alojamientoservice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Alojamientoservice);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
