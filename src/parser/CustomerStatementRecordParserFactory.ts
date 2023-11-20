import { CSVCustomerStatementRecordParser } from "./CSVCustomerStatementRecordParser";
import { CustomerStatementRecordParser } from "./CustomerStatementRecordParser";
import { XMLCustomerStatementRecordParser } from "./XMLCustomerStatementRecordParser";

const XML_FILE_TYPE = 'application/xml';
const XML_ALTERNATIVE_FILE_TYPE = 'text/xml';
const CSV_FILE_TYPE = 'text/csv';

export class CustomerStatementRecordParserFactory {
  public static fromFile(file: File): CustomerStatementRecordParser {
    switch (file.type) {
      case CSV_FILE_TYPE:
        return new CSVCustomerStatementRecordParser(file);
      case XML_FILE_TYPE:
      case XML_ALTERNATIVE_FILE_TYPE:
        return new XMLCustomerStatementRecordParser(file);
    }

    throw new Error(`parser for file type '${file.type}' is not implemented`);
  }
}