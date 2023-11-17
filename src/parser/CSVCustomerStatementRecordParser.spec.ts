import { lastValueFrom, reduce, take, catchError, of } from "rxjs";
import { CSVCustomerStatementRecordParser } from "./CSVCustomerStatementRecordParser";
import { RawCustomerStatementRecord } from "@/model/RawCustomerStatementRecord";
import { MalformedRecord } from "./errors/MalformedRecord";

describe('CSVCustomerStatementRecordParser tests', () => {
  it('`loadRecords` should start parsing the CSV and return an observable of the parsed records', async () => {
    const csv = [
      'Reference,Account Number,Description,Start Balance,Mutation,End Balance\n',
      '183398,NL56RABO0149876948,Clothes from Richard de Vries,33.34,+5.55,38.89\n',
      '112806,NL27SNSB0917829871,Subscription from Jan Dekker,28.95,-19.44,9.51\n'
    ].join('');
    const parser = new CSVCustomerStatementRecordParser(
      new File([csv], 'records.csv', {
        type: 'text/csv'
      })
    );

    const records = await lastValueFrom(
      parser.loadRecords().pipe(
        reduce((acc, cur) => [...acc, cur], [] as RawCustomerStatementRecord[]),
      )
    );

    expect(records).toEqual([
      {
        transactionReference: '183398',
        accountNumber: 'NL56RABO0149876948',
        description: 'Clothes from Richard de Vries',
        startBalance: '33.34',
        mutation: '+5.55',
        endBalance: '38.89'
      },
      {
        transactionReference: '112806',
        accountNumber: 'NL27SNSB0917829871',
        description: 'Subscription from Jan Dekker',
        startBalance: '28.95',
        mutation: '-19.44',
        endBalance: '9.51'
      }
    ] as RawCustomerStatementRecord[]);
  });

  it('parsing should use `undefined` as a field\'s value if that field doesn\'t have a value', async () => {
    const csv = [
      'Reference,Account Number,Description,Start Balance,Mutation,End Balance\n',
      '183398,NL56RABO0149876948,Clothes from Richard de Vries,,+5.55,38.89\n',
      '112806,NL27SNSB0917829871,Subscription from Jan Dekker,28.95,,9.51\n'
    ].join('');
    const parser = new CSVCustomerStatementRecordParser(
      new File([csv], 'records.csv', {
        type: 'text/csv'
      })
    );

    const records = await lastValueFrom(
      parser.loadRecords().pipe(
        reduce((acc, cur) => [...acc, cur], [] as RawCustomerStatementRecord[]),
      )
    );

    expect(records).toEqual([
      {
        transactionReference: '183398',
        accountNumber: 'NL56RABO0149876948',
        description: 'Clothes from Richard de Vries',
        startBalance: undefined,
        mutation: '+5.55',
        endBalance: '38.89'
      },
      {
        transactionReference: '112806',
        accountNumber: 'NL27SNSB0917829871',
        description: 'Subscription from Jan Dekker',
        startBalance: '28.95',
        mutation: undefined,
        endBalance: '9.51'
      }
    ] as RawCustomerStatementRecord[])
  });

  it('stream should be supplied with a `MalformedRecord` object in case there is an error during parsing', async () => {
    const malformedCsv = [
      'Reference,Account Number,Description,Start Balance,Mutation,End Balance\n',
      '183398,NL56RABO0149876948,Clothes from Richard de Vries,33.34,+5.55,38.89\n',
      '112806,NL27SNSB0917829871,Subscription from Jan Dekker,-19.44,9.51\n'
    ].join('');
    const parser = new CSVCustomerStatementRecordParser(
      new File([malformedCsv], 'records.csv', {
        type: 'text/csv'
      })
    );

    await expect(() => lastValueFrom(parser.loadRecords())).rejects.toThrow(new MalformedRecord());
  });
});
