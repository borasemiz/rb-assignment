import { ValidationReport } from "@/validator/ValidationReport";

interface Props {
  reports: ValidationReport[];
}

export function PrintReports({ reports }: Props) {
  return (
    reports.map(({ rawRecord, errors }, index) => (
      <div className="my-4 bg-red-900 text-white" key={index}>
        <p>
          <strong>There were errors validating the file:</strong>
        </p>

        <ul className="mb-4">
          {errors.map((error, index) => (
            <li key={index}>{error.message}</li>
          ))}
        </ul>

        <p>Transaction Reference: {rawRecord.transactionReference ?? <NotAvailable />}</p>
        <p>Account Number: {rawRecord.accountNumber ?? <NotAvailable />}</p>
        <p>Description: {rawRecord.description ?? <NotAvailable />}</p>
        <p>End Balance: {rawRecord.endBalance ?? <NotAvailable />}</p>
        <p>Start Balance: {rawRecord.startBalance ?? <NotAvailable />}</p>
        <p>Mutation Balance: {rawRecord.mutation ?? <NotAvailable />}</p>
      </div>
    ))
  )
}

function NotAvailable() {
  return <strong>Not Available</strong>
}