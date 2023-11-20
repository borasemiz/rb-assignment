import { Observable, Subject } from "rxjs";
import { CustomerStatementRecordParser } from "./CustomerStatementRecordParser";
import { RawCustomerStatementRecord } from "@/model/RawCustomerStatementRecord";

/**
 * This is a base class for parsing customer statement records from a file. It provides common
 * functionality for reading the file and emitting the parsed records.
 */
export abstract class FileCustomerStatementRecordParser implements CustomerStatementRecordParser {
  /**
   * Use this subject to emit the parsed records.
   */
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

  /**
   * The reader reads the file in chunks. This method is called for each chunk. This method is expected
   * to parse the change into `RawCustomerStatementRecord`s. The parsed `RawCustomerStatementRecord`s should be provided via `recordStream$$` subject.
   * If the parsing fails, this method should resolve to `false`.
   * Otherwise `true`. You must override this method to add your specific parsing logic.
   * @param chunk Chunk of content of the file
   */
  protected abstract tryParsingNextChunk(chunk: string): Promise<boolean>;

  /**
   * When the file is completely read, this method is called.
   * You must override this method to close the `recordStream$$` subject and your custom clean-up logic, if any.
   */
  protected abstract closeStream(): void;
}