import { CSVCustomerStatementRecordParser } from "./CSVCustomerStatementRecordParser";
import { CustomerStatementRecordParser } from "./CustomerStatementRecordParser";

const CSV_FILE_TYPE = 'text/csv';

export class CustomerStatementRecordParserFactory {
  public static fromFile(file: File): CustomerStatementRecordParser {
    switch (file.type) {
      case CSV_FILE_TYPE:
        return new CSVCustomerStatementRecordParser(file);
    }

    throw new Error(`parser for file type '${file.type}' is not implemented`);
  }
}