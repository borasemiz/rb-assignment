export class ProcessingError extends Error {
  constructor(public errors: Error[]) {
    super('There were processing errors');
  }
}