import { FormatError } from "@/validator/errors/FormatError";
import { ValidationError } from "@/validator/errors/ValidationError";

interface Params {
  callback: () => unknown;
  expectedFormatErrors: FormatError[];
}

export function expectValidationErrorToBeThrown({ callback, expectedFormatErrors }: Params) {
  try {
    callback();

    throw 'should have thrown';
  } catch (e) {
    if (e instanceof ValidationError) {
      expect(e.errors).toEqual(expectedFormatErrors)
    } else {
      throw e;
    }
  }
}