'use client';
import { ChangeEventHandler } from "react";

interface Props {
  onFileProvided(file: File): void;
}

export function UploadCustomerStatements({ onFileProvided }: Props) {
  const handleFileChange: ChangeEventHandler<HTMLInputElement> = ({ target }) => {
    if (target.files?.[0] !== undefined) {
      onFileProvided(target.files[0]);
    }
  };

  return (
    <>
      <label className="block" htmlFor="load-customer-statements">Load customer statements (XML or CSV):</label>
      
      <input
        className="block"
        id="load-customer-statements"
        type="file"
        accept="text/csv,application/xml"
        onChange={handleFileChange}
      />
    </>
  );
}