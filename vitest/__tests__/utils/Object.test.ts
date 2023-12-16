import { expect, test } from "vitest";

import {
  clearGraphQLPaginationObjectKeys,
  generateCSSFromCSSProperties,
} from "src/utils/Object";

test("Functions", () => {
  const mockQueryVariables:
    | {
        after?: string;
        before?: string;
        first?: number;
      }
    | {
        after?: string;
        before?: string;
        last?: number;
      } = {
    last: 10,
    before: "WyIyMDIzLTExLTExVDE3OjIwOjU1LjM5NzcyNiswNzowMCIsIDI0XQ==",
  };

  clearGraphQLPaginationObjectKeys(mockQueryVariables);

  expect(mockQueryVariables).toEqual({});
});

test("Object", () => {
  expect(
    generateCSSFromCSSProperties({
      position: "sticky",
      top: 0,
      overflowX: "hidden",
    })
  ).equal("position:sticky;top:0;overflow-x:hidden;");
});
