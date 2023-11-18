import { z } from 'zod';
import { CustomerStatementRecord } from "@/model/CustomerStatementRecord";
import { RawCustomerStatementRecord } from "@/model/RawCustomerStatementRecord";
import { FormatError } from './errors/FormatError';
import { ProcessingError } from './errors/ProcessingError';

interface ValidateFieldParams {
  fieldName: string;
  fieldValue: unknown;
  schema: z.ZodSchema;
}

const IBAN_NUMBER_FORMAT_REGEX = /^[A-Z]{2}\d{2}[A-Z]{4}\d{10}$/i;

const numberFormat = z.string().min(1).refine(value => !Number.isNaN(+value))
const transactionReferenceFormat = z.string().length(6).regex(/^[0-9]*$/g);
const accountNumberFormat = z.string().regex(IBAN_NUMBER_FORMAT_REGEX);
const descriptionFormat = z.string().min(1);
const mutationFormat = z.string().min(2).refine(value => {
  if (!value.startsWith('+') && !value.startsWith('-')) return false;

  return !Number.isNaN(+value.slice(1));
});

export function processRawCustomerStatementRecord(record: RawCustomerStatementRecord): CustomerStatementRecord {
  validateRecord(record)

  return {
    accountNumber: record.accountNumber as string,
    description: record.description as string,
    endBalance: +(record.endBalance as string),
    mutation: record.mutation as string,
    startBalance: +(record.startBalance as string),
    transactionReference: record.transactionReference as string
  };
}

function validateRecord({ accountNumber, description, endBalance, mutation, startBalance, transactionReference }: RawCustomerStatementRecord) {
  const errors: FormatError[] = [
    validateField({
      fieldName: 'Account number',
      fieldValue: accountNumber,
      schema: accountNumberFormat
    }),
    validateField({
      fieldName: 'Description',
      fieldValue: description,
      schema: descriptionFormat,
    }),
    validateField({
      fieldName: 'End balance',
      fieldValue: endBalance,
      schema: numberFormat,
    }),
    validateField({
      fieldName: 'Start balance',
      fieldValue: startBalance,
      schema: numberFormat,
    }),
    validateField({
      fieldName: 'Mutation',
      fieldValue: mutation,
      schema: mutationFormat,
    }),
    validateField({
      fieldName: 'Transaction reference',
      fieldValue: transactionReference,
      schema: transactionReferenceFormat,
    }),
  ].filter((error): error is FormatError => error !== undefined);

  if (errors.length > 0) {
    throw new ProcessingError(errors);
  }
}

function validateField({ fieldName, fieldValue, schema }: ValidateFieldParams): FormatError | undefined {
  const { success } = schema.safeParse(fieldValue);

  return success ? undefined : new FormatError(fieldName);
}
