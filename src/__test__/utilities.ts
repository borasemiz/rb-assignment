import { FormatError } from "@/validator/errors/FormatError";
import { ProcessingError } from "@/validator/errors/ProcessingError";

interface Params {
  callback: () => unknown;
  expectedFormatErrors: FormatError[];
}

export function expectValidationErrorToBeThrown({ callback, expectedFormatErrors }: Params) {
  try {
    callback();

    throw 'should have thrown';
  } catch (e) {
    if (e instanceof ProcessingError) {
      expect(e.errors).toEqual(expectedFormatErrors)
    } else {
      throw e;
    }
  }
}