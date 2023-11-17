import { RawCustomerStatementRecord } from "@/model/RawCustomerStatementRecord";
import { Observable } from "rxjs";

export interface CustomerStatementRecordParser {
  loadRecords(): Observable<RawCustomerStatementRecord>;
}