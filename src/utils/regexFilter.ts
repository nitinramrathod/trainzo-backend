
export const regexFilter = (  field: string,
  value: string | undefined,
  filter: Record<string, any>): void => {
  if (value) {
    filter[field] = { $regex: value, $options: "i" };
  }
};
