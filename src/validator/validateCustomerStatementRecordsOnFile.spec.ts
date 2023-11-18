import { MalformedRecord } from "@/parser/errors/MalformedRecord";
import type { ValidationReport } from "./ValidationReport";
import { EndBalanceWrong } from "./errors/EndBalanceWrong";
import { FormatError } from "./errors/FormatError";
import { ProcessingError } from "./errors/ProcessingError";
import { TransactionReferenceNotUnique } from "./errors/TransactionReferenceNotUnique";
import { validateCustomerStatementRecordsOnFile } from "./validateCustomerStatementRecordsOnFile";

const duplicateTransactionReference = [
  'Reference,Account Number,Description,Start Balance,Mutation,End Balance\n',
  '183398,NL56RABO0149876948,Clothes from Richard de Vries,33.34,+5.55,38.89\n',
  '112806,NL27SNSB0917829871,Subscription from Jan Dekker,28.95,-19.44,9.51\n',
  '183398,NL56RABO0129846958,Lorem Ipsum,33.34,+5.55,38.89\n',
].join('');

const wrongEndBalance = [
  'Reference,Account Number,Description,Start Balance,Mutation,End Balance\n',
  '183398,NL56RABO0149876948,Clothes from Richard de Vries,33.34,+5.55,38.89\n',
  '112806,NL27SNSB0917829871,Subscription from Jan Dekker,28.95,-19.44,0.51\n',
  '178521,NL56RABO0129846958,Lorem Ipsum,33.34,+5.55,38.89\n',
  '256246,NL24RABO0569304918,Muspi merol,33.34,+5.55,28.25\n',
].join('');

const wrongFormat = [
  'Reference,Account Number,Description,Start Balance,Mutation,End Balance\n',
  '183398,NL56RABO0149876948,Clothes from Richard de Vries,33.34,+5.55,38.89\n',
  '112806,NL27SNSB0917829871,,28.95,-19.44,9.51\n',
  '183357,,Lorem Ipsum,33.34,+5.55,38.89\n',
].join('');

const malformed = [
  'Reference,Account Number,Description,Start Balance,Mutation,End Balance\n',
  '183398,Clothes from Richard de Vries,33.34,+5.55,38.89\n',
  '112806,NL27SNSB0917829871,,28.95,9.51\n',
  '183357,,Lorem Ipsum,33.34,+5.55,38.89\n',
].join('');

describe('validateCustomerStatementRecordsOnFile tests', () => {
  it('given a file that contains non-unique transaction references, it should indicate those non-unique transaction references', async () => {
    const file = new File([duplicateTransactionReference], 'records.csv', {
      type: 'text/csv',
    });

    const report = await validateCustomerStatementRecordsOnFile(file);

    expect(report).toEqual([
      {
        rawRecord: {
          accountNumber: 'NL56RABO0129846958',
          description: 'Lorem Ipsum',
          endBalance: '38.89',
          mutation: '+5.55',
          startBalance: '33.34',
          transactionReference: '183398',
        },
        errors: [new TransactionReferenceNotUnique()]
      },
    ] as ValidationReport[])
  });

  it('given a file that contains records with wrong end balance, it should indicate those', async () => {
    const file = new File([wrongEndBalance], 'records.csv', {
      type: 'text/csv',
    });

    const report = await validateCustomerStatementRecordsOnFile(file);

    expect(report).toEqual([
      {
        rawRecord: {
          accountNumber: 'NL27SNSB0917829871',
          description: 'Subscription from Jan Dekker',
          endBalance: '0.51',
          mutation: '-19.44',
          startBalance: '28.95',
          transactionReference: '112806',
        },
        errors: [new EndBalanceWrong()]
      },
      {
        rawRecord: {
          accountNumber: 'NL24RABO0569304918',
          description: 'Muspi merol',
          endBalance: '28.25',
          mutation: '+5.55',
          startBalance: '33.34',
          transactionReference: '256246',
        },
        errors: [new EndBalanceWrong()]
      },
    ] as ValidationReport[])
  });

  it('given an incorrectly formatted file, the generated report should indicate what the format errors are', async () => {
    const file = new File([wrongFormat], 'records.csv', {
      type: 'text/csv',
    });

    const report = await validateCustomerStatementRecordsOnFile(file);

    expect(report).toEqual([
      {
        rawRecord: {
          transactionReference: '112806',
          accountNumber: 'NL27SNSB0917829871',
          description: undefined,
          startBalance: '28.95',
          mutation: '-19.44',
          endBalance: '9.51',
        },
        errors: [new ProcessingError([new FormatError('Description')])],
      },
      {
        rawRecord: {
          transactionReference: '183357',
          accountNumber: undefined,
          description: 'Lorem Ipsum',
          startBalance: '33.34',
          mutation: '+5.55',
          endBalance: '38.89',
        },
        errors: [new ProcessingError([new FormatError('Account number')])]
      },
    ] as ValidationReport[]);
  });

  it('given a malformed file, it should throw an error', async () => {
    const file = new File([malformed], 'records.csv', {
      type: 'text/csv',
    });

    await expect(() => validateCustomerStatementRecordsOnFile(file)).rejects.toThrow(MalformedRecord);
  });
});
