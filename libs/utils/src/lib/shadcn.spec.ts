import { cn } from "./shadcn.util";

describe("utils", () => {
  it("should work", () => {
    expect(cn("bg-red-50", "bg-black")).toEqual("bg-black");
  });
});
