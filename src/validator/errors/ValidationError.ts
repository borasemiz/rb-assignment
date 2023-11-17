export class ValidationError extends Error {
  constructor(public errors: Error[]) {
    super('There were validation errors');
  }
}