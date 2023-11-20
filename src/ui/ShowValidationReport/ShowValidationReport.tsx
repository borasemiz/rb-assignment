'use client';

import { ValidationReport } from "@/validator/ValidationReport";
import { validateCustomerStatementRecordsOnFile } from "@/validator/validateCustomerStatementRecordsOnFile";
import { PrintReports } from './PrintReports';
import { useEffect, useState } from "react";
import { FileMalformedError } from "./FileMalformedError";
import { ValidEntries } from "./ValidEntries";

interface Props {
  file: File;
}

export function ShowValidationReport({ file }: Props) {
  const [reports, setReports] = useState<ValidationReport[]>();
  const [isFileMalformed, setIsFileMalformed] = useState(false);

  useEffect(() => {
    setReports(undefined);
    validateCustomerStatementRecordsOnFile(file)
      .then(setReports)
      .catch(() => setIsFileMalformed(true));
  }, [file]);

  return (
    <>
      {isFileMalformed && <FileMalformedError />}
      {Array.isArray(reports) && reports.length === 0 && <ValidEntries />}
      {Array.isArray(reports) && reports.length > 0 && <PrintReports reports={reports} />}
    </>
  );
}
