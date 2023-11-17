import { Observable, Subject } from "rxjs";
import { CustomerStatementRecordParser } from "./CustomerStatementRecordParser";
import { RawCustomerStatementRecord } from "@/model/RawCustomerStatementRecord";

export abstract class FileCustomerStatementRecordParser implements CustomerStatementRecordParser {
  protected recordStream$$ = new Subject<RawCustomerStatementRecord>();
  protected fileReader: ReadableStreamDefaultReader<string>;

  constructor(file: File) {
    this.fileReader = file.stream().pipeThrough(new TextDecoderStream()).getReader();
  }

  public abstract loadRecords(): Observable<RawCustomerStatementRecord>;
}