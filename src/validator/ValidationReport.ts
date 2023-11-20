import { RawCustomerStatementRecord } from "@/model/RawCustomerStatementRecord";

export interface ValidationReport {
  rawRecord: RawCustomerStatementRecord;
  errors: Error[];
}

export function isValidationReport(thing: unknown): thing is ValidationReport {
  return (
    typeof thing === 'object' &&
    thing !== null &&
    'errors' in thing &&
    Array.isArray(thing.errors)
  )
}