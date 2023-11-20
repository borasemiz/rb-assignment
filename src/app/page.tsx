'use client';
import { ShowValidationReport } from "@/ui/ShowValidationReport";
import { UploadCustomerStatements } from "@/ui/UploadCustomerStatements";
import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState<File>();

  return (
    <main>
      <UploadCustomerStatements onFileProvided={setFile} />

      {file !== undefined && <ShowValidationReport file={file} />}
    </main>
  )
}
