import { CSVParser } from "incremental-csv-parser";
import { FileCustomerStatementRecordParser } from "./FileCustomerStatementRecordParser";
import { MalformedRecord } from "./errors/MalformedRecord";
import { Observable } from "rxjs";
import { RawCustomerStatementRecord } from "@/model/RawCustomerStatementRecord";

const COLUMN_REFERENCE = 'Reference';
const COLUMN_ACCOUNT_NUMBER = 'Account Number';
const COLUMN_DESCRIPTION = 'Description';
const COLUMN_START_BALANCE = 'Start Balance'
const COLUMN_MUTATION = 'Mutation';
const COLUMN_END_BALANCE = 'End Balance';

type ColumnName =
  | typeof COLUMN_REFERENCE
  | typeof COLUMN_ACCOUNT_NUMBER
  | typeof COLUMN_DESCRIPTION
  | typeof COLUMN_START_BALANCE
  | typeof COLUMN_MUTATION
  | typeof COLUMN_END_BALANCE

export class CSVCustomerStatementRecordParser extends FileCustomerStatementRecordParser {
  private csvParser: CSVParser<ColumnName>;
  
  constructor(file: File) {
    super(file);

    this.csvParser = new CSVParser((data) => this.recordStream$$.next({
      accountNumber: this.useUndefinedIfEmpty(data["Account Number"]),
      description: this.useUndefinedIfEmpty(data.Description),
      endBalance: this.useUndefinedIfEmpty(data["End Balance"]),
      mutation: this.useUndefinedIfEmpty(data.Mutation),
      startBalance: this.useUndefinedIfEmpty(data["Start Balance"]),
      transactionReference: this.useUndefinedIfEmpty(data["Reference"])
    }));
  }

  public loadRecords(): Observable<RawCustomerStatementRecord> {
    this.startLoading();
    return this.recordStream$$.asObservable();
  }

  private async startLoading() {
    while (true) {
      const { value, done } = await this.fileReader.read();
      if (done || value === undefined) {
        this.closeStream();
        break;
      }

      if (!this.tryParsingNextChunk(value)) break;
    }
  }

  private async tryParsingNextChunk(value: string): Promise<boolean> {
    try {
      await this.csvParser.process(value);
    } catch (e) {
      this.recordStream$$.error(new MalformedRecord());
      return false;
    }

    return true;
  }

  private closeStream() {
    try {
      this.csvParser.flush();
      this.recordStream$$.complete();
    } catch (e) {
      this.recordStream$$.error(new MalformedRecord());
    }
  }

  private useUndefinedIfEmpty(value: string) {
    return value === '' ? undefined : value;
  }
}