export class FormatError extends Error {
  constructor(field: string) {
    super(`${field} is not in a correct format`);
  }
}
