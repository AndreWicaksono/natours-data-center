import { expect, test } from "vitest";

import { arraySliceIntoChunks } from "src/utils/Array";

test("Array", () => {
  expect(
    arraySliceIntoChunks(["A", "B", "C", "D", "E", "F", "G", "H"], 4)
  ).toEqual([
    ["A", "B", "C", "D"],
    ["E", "F", "G", "H"],
  ]);
});
