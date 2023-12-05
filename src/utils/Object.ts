import { CSSProperties } from "react";

import { camelCaseToKebabCase } from "src/utils/String";

export const generateCSSFromCSSProperties = (
  cssObject: CSSProperties
): string => {
  // Written by: Thành Trang - https://stackoverflow.com/a/63772178
  return Object.keys(cssObject).reduce((accumulator, key) => {
    const cssKey = camelCaseToKebabCase(key);
    const cssValue: string =
      typeof cssObject[key as keyof typeof cssObject] === "string"
        ? (cssObject[key as keyof typeof cssObject] as string).replace('"', "")
        : `${cssObject[key as keyof typeof cssObject]}`;

    return `${accumulator}${cssKey}:${cssValue};`;
  }, "");
};

export const clearGraphQLPaginationObjectKeys = (state: object): void => {
  const gqlPaginationKeys: string[] = ["after", "before", "first", "last"];

  gqlPaginationKeys.forEach(
    (itemKey) => delete state[itemKey as keyof typeof state]
  );
};
