import { expect, test } from "vitest";

import { formatRupiah } from "src/utils/Number";

test("Number", () => {
  expect(formatRupiah(8000000000)).toEqual("Rp8.000.000.000");
});
