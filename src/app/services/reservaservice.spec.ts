import { TestBed } from "@angular/core/testing";
import { Reservaservice } from "./reservaservice";

describe("Reservaservice", () => {
  let service: Reservaservice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Reservaservice);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
