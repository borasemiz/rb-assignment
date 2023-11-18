import { CustomerStatementRecordParserFactory } from "@/parser/CustomerStatementRecordParserFactory";
import { ValidationReport, isValidationReport } from "./ValidationReport";
import { TransactionReferenceUniquenessChecker } from "./TransactionReferenceUniquenessChecker";
import { processRawCustomerStatementRecord } from "./processRawCustomerStatementRecord";
import { RawCustomerStatementRecord } from "@/model/RawCustomerStatementRecord";
import { CustomerStatementRecord } from "@/model/CustomerStatementRecord";
import { TransactionReferenceNotUnique } from "./errors/TransactionReferenceNotUnique";
import { validateEndBalance } from "./validateEndBalance";
import { EndBalanceWrong } from "./errors/EndBalanceWrong";

export async function validateCustomerStatementRecordsOnFile(file: File): Promise<ValidationReport[]> {
  return new Promise((resolve, reject) => {
    const parser = CustomerStatementRecordParserFactory.fromFile(file);
    const uniquenessChecker = new TransactionReferenceUniquenessChecker();
    const reports: ValidationReport[] = [];

    parser.loadRecords().subscribe({
      next: (rawRecord) => {
        const reportOrRecord = processRecord(rawRecord);

        if (isValidationReport(reportOrRecord)) {
          reports.push(reportOrRecord);
        } else {
          const record = reportOrRecord;
          
          const isTransactionReferenceUnique = uniquenessChecker.checkUnique(record.transactionReference);
          if (!isTransactionReferenceUnique) {
            reports.push({
              rawRecord,
              errors: [new TransactionReferenceNotUnique()],
            });
          }

          const isEndBalanceCorrect = validateEndBalance(record);
          if (!isEndBalanceCorrect) {
            reports.push({
              rawRecord,
              errors: [new EndBalanceWrong()],
            });
          }
        }
      },
      error: (error) => reject(error),
      complete:() => resolve(reports)
    });
  });
}

function processRecord(rawRecord: RawCustomerStatementRecord): ValidationReport | CustomerStatementRecord {
  try {
    return processRawCustomerStatementRecord(rawRecord);
  } catch (e) {
    if (e instanceof Error) {
      return {
        rawRecord,
        errors: [e]
      }
    }
    
    throw e;
  }
}