/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import { MalformedRecord } from '@/parser/errors/MalformedRecord';
import { validateCustomerStatementRecordsOnFile } from '../../validator/validateCustomerStatementRecordsOnFile';
import { ShowValidationReport } from './ShowValidationReport';
import { EndBalanceWrong } from '@/validator/errors/EndBalanceWrong';
import { TransactionReferenceNotUnique } from '@/validator/errors/TransactionReferenceNotUnique';
import { ProcessingError } from '@/validator/errors/ProcessingError';

jest.mock('../../validator/validateCustomerStatementRecordsOnFile');

const mockValidate = jest.mocked(validateCustomerStatementRecordsOnFile);

describe('ShowValidationReport component tests', () => {
  it('if validator throws an error, the page should show a "malformed file" error message', async () => {
    mockValidate.mockRejectedValueOnce(new MalformedRecord());
  
    render(<ShowValidationReport file={new File([], 'test.csv')} />);

    await screen.findByText('The file is either corrupted or its contents not correctly formatted. Therefore can\'t validate its entries.');
  });

  it('if validator resolves to an empty array, the page should show a "valid entries" message', async () => {
    mockValidate.mockResolvedValueOnce([]);

    render(<ShowValidationReport file={new File([], 'test.csv')} />);

    await screen.findByText('All the entries in the file are valid.');
  });

  it('if validator resolves to an array of reports that contains error for end balance, it should show the correct error', async () => {
    mockValidate.mockResolvedValueOnce([
      {
        errors: [new EndBalanceWrong()],
        rawRecord: {},
      }
    ]);

    render(<ShowValidationReport file={new File([], 'test.csv')} />);

    await screen.findByText('EndBalanceWrong');
  });

  it('if validator resolves to an array of reports that contains error for transaction reference, it should show the correct error', async () => {
    mockValidate.mockResolvedValueOnce([
      {
        errors: [new TransactionReferenceNotUnique()],
        rawRecord: {},
      }
    ]);

    render(<ShowValidationReport file={new File([], 'test.csv')} />);

    await screen.findByText('TransactionReferenceNotUnique');
  });

  it('if validator detects there are missing fields, it should indicate which fields are not detected', async () => {
    mockValidate.mockResolvedValueOnce([
      {
        errors: [new ProcessingError([])],
        rawRecord: {
          transactionReference: '123432',
          startBalance: '321',
          endBalance: '123',
          description: 'Bora is awesome',
          mutation: '+21',
        },
      }
    ]);

    render(<ShowValidationReport file={new File([], 'test.csv')} />);

    const elem = await screen.findByText('Account Number:');

    expect(elem.querySelector('strong')?.innerHTML).toBe('Not Available');
  });
});
