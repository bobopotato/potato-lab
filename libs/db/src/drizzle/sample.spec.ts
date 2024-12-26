// libs/db/src/drizzle/sample.spec.ts

describe("Fake Mock Spec", () => {
  it("should mock a fake test case", () => {
    expect(true).toBe(true);
  });

  it("should mock another fake test case", () => {
    const mockFunction = jest.fn(() => "mocked value");
    expect(mockFunction()).toBe("mocked value");
    expect(mockFunction).toHaveBeenCalled();
  });
});
