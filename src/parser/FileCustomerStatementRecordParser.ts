import { Observable, Subject } from "rxjs";
import { CustomerStatementRecordParser } from "./CustomerStatementRecordParser";
import { RawCustomerStatementRecord } from "@/model/RawCustomerStatementRecord";

export abstract class FileCustomerStatementRecordParser implements CustomerStatementRecordParser {
  protected recordStream$$ = new Subject<RawCustomerStatementRecord>();
  protected fileReader: ReadableStreamDefaultReader<string>;

  constructor(file: File) {
    this.fileReader = file.stream().pipeThrough(new TextDecoderStream()).getReader();
  }

  public loadRecords(): Observable<RawCustomerStatementRecord> {
    this.startLoading();
    return this.recordStream$$.asObservable();
  }

  protected async startLoading() {
    while (true) {
      const { value, done } = await this.fileReader.read();
      if (done || value === undefined) {
        this.closeStream();
        break;
      }

      if (!this.tryParsingNextChunk(value)) break;
    }
  }

  protected abstract tryParsingNextChunk(chunk: string): Promise<boolean>;
  protected abstract closeStream(): void;
}