import { TestBed } from "@angular/core/testing";
import { Resenaservice } from "./resenaservice";

describe("Resenaservice", () => {
  let service: Resenaservice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Resenaservice);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
