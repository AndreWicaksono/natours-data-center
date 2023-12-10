import { expect, test } from "vitest";

import {
  camelCaseToKebabCase,
  generateDuplicateFilename,
} from "src/utils/String";

test("String", () => {
  expect(generateDuplicateFilename("Photo.webp")).toBe("Photo(1).webp");
  expect(camelCaseToKebabCase("kebabCase")).toBe("kebab-case");
});
