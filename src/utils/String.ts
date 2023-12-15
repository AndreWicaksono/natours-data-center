import { isLetterUpperCase } from "src/utils/RegExp";

export const camelCaseToKebabCase = (input: string) =>
  input.replace(isLetterUpperCase, (v) => `-${v.toLowerCase()}`);

export const generateDuplicateFilename = (filename: string): string => {
  let newFilename = "";

  const filenameElements = filename.split(".");

  if (filenameElements[0].split("(").length > 1) {
    const previousDuplicateNumber = Number(
      filenameElements[0].split("(")[1].replace(")", "")
    );

    newFilename = `${filenameElements[0].split("(")[0]}(${
      previousDuplicateNumber + 1
    }).${filenameElements[1]}`;
  } else {
    newFilename = `${filenameElements[0]}(1).${filenameElements[1]}`;
  }

  return newFilename;
};

export const generateSlug = (input: string): string => {
  const result: string = input;

  return result.replaceAll(" ", "").toLowerCase().replaceAll(" ", "-");
};
