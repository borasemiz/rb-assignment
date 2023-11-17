import { z } from 'zod';
import { CustomerStatementRecord } from "@/model/CustomerStatementRecord";
import { RawCustomerStatementRecord } from "@/model/RawCustomerStatementRecord";

const isInNumberFormat = () => z.string().min(1).refine(value => !Number.isNaN(+value))
const mutationFormat = () => z.string().min(2).refine(value => {
  if (!value.startsWith('+') && !value.startsWith('-')) return false;

  return !Number.isNaN(+value.slice(1));
})

const recordSchema = z.object({
  transactionReference: z.string().length(6).regex(/^[0-9]*$/g),
  accountNumber: z.string().regex(/^[A-Z]{2}\d{2}[A-Z]{4}\d{10}$/i),
  startBalance: isInNumberFormat(),
  mutation: mutationFormat(),
  endBalance: isInNumberFormat(),
  description: z.string().min(1),
});

export function processRawCustomerStatementRecord(record: RawCustomerStatementRecord): CustomerStatementRecord {
  recordSchema.parse(record);

  return {
    accountNumber: record.accountNumber as string,
    description: record.description as string,
    endBalance: +(record.endBalance as string),
    mutation: record.mutation as string,
    startBalance: +(record.startBalance as string),
    transactionReference: record.transactionReference as string
  };
}
