import { expect, test } from "vitest";

import { isLetterUpperCase, isValidEmail } from "src/utils/RegExp";

test("RegExp", () => {
  expect(isValidEmail.test("email@vitest.dev")).toBe(true);
  expect(isValidEmail.test("email")).toBe(false);
  expect(isLetterUpperCase.test("A")).toBe(true);
  expect(isLetterUpperCase.test("z")).toBe(false);
});
