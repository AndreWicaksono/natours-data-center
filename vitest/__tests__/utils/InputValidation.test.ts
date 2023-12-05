import { expect, test } from "vitest";

import { validateRequirementOfMandatory } from "src/utils/InputValidation";

test("InputValidation", () => {
  expect(validateRequirementOfMandatory("value")).toBe(true);
});
