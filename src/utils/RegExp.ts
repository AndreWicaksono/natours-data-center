export const isLetterUpperCase = new RegExp(/[A-Z]/g);

export const isLowerCaseAndNumbers = new RegExp(/[a-z0-9]/);

export const isValidEmail = new RegExp(
  /^([a-z0-9_\-.]+)@([a-z0-9_\-.]+)\.([a-z]{2,5})$/i
);

export const isValidSlug = new RegExp("^[a-z0-9]+(?:-[a-z0-9]+)*$");
