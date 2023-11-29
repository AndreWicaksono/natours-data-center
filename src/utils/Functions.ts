export const clearGraphQLPaginationObjectKeys = (state: object): void => {
  const gqlPaginationKeys: string[] = ["after", "before", "first", "last"];

  gqlPaginationKeys.forEach(
    (itemKey) => delete state[itemKey as keyof typeof state]
  );
};
