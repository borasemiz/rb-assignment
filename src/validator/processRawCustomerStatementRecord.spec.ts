import { FormatError } from './errors/FormatError';
import { processRawCustomerStatementRecord } from './processRawCustomerStatementRecord';
import { expectValidationErrorToBeThrown } from '@/__test__/utilities';

describe('processRawCustomerStatementRecord tests', () => {
  it('should throw validation error any of the fields are not present', () => {
    expectValidationErrorToBeThrown({
      callback: () => processRawCustomerStatementRecord({}),
      expectedFormatErrors: [
        new FormatError('Account number'),
        new FormatError('Description'),
        new FormatError('End balance'),
        new FormatError('Start balance'),
        new FormatError('Mutation'),
        new FormatError('Transaction reference')
      ]
    });
  });

  it('should throw error if transaction reference is not made up of numbers', () => {
    expectValidationErrorToBeThrown({
      callback: () => processRawCustomerStatementRecord({
        accountNumber: 'NL89ABNA1234123412',
        description: 'qweqwe',
        endBalance: '321',
        mutation: '+21',
        startBalance: '123',
        transactionReference: '3d1123'
      }),
      expectedFormatErrors: [new FormatError('Transaction reference')]
    });
  });

  it('should throw error if transaction reference is not made up of 6 characters', () => {
    expectValidationErrorToBeThrown({
      callback: () => processRawCustomerStatementRecord({
        accountNumber: 'NL89ABNA1234123412',
        description: 'qweqwe',
        endBalance: '321',
        mutation: '+21',
        startBalance: '123',
        transactionReference: '35123'
      }),
      expectedFormatErrors: [new FormatError('Transaction reference')]
    });
  });

  it('should throw error if the account number is not in correct format', () => {
    expectValidationErrorToBeThrown({
      callback: () => processRawCustomerStatementRecord({
        accountNumber: 'NL89ABNA1233412',
        description: 'qweqwe',
        endBalance: '321',
        mutation: '+21',
        startBalance: '123',
        transactionReference: '351233'
      }),
      expectedFormatErrors: [new FormatError('Account number')]
    });
  });

  it('should throw error if start balance is not a number', () => {
    expectValidationErrorToBeThrown({
      callback: () => processRawCustomerStatementRecord({
        accountNumber: 'NL89ABNA1234123412',
        description: 'qweqwe',
        endBalance: '321',
        mutation: '+21',
        startBalance: '12a321',
        transactionReference: '351233'
      }),
      expectedFormatErrors: [new FormatError('Start balance')]
    });
  });

  it('should throw error if end balance is not a number', () => {
    expectValidationErrorToBeThrown({
      callback: () => processRawCustomerStatementRecord({
        accountNumber: 'NL89ABNA1234123412',
        description: 'qweqwe',
        endBalance: '32f1',
        mutation: '+21',
        startBalance: '12321',
        transactionReference: '351233'
      }),
      expectedFormatErrors: [new FormatError('End balance')]
    });
  });

  it('should throw error if mutation doesn\'t start with either "-" or "+"', () => {
    expectValidationErrorToBeThrown({
      callback: () => processRawCustomerStatementRecord({
        accountNumber: 'NL89ABNA1234123412',
        description: 'qweqwe',
        endBalance: '321',
        mutation: '21',
        startBalance: '12321',
        transactionReference: '351233'
      }),
      expectedFormatErrors: [new FormatError('Mutation')]
    });
  });

  it('should throw error if mutation is not a number after the sign', () => {
    expectValidationErrorToBeThrown({
      callback: () => processRawCustomerStatementRecord({
        accountNumber: 'NL89ABNA1234123412',
        description: 'qweqwe',
        endBalance: '321',
        mutation: '+21.241wq',
        startBalance: '12321',
        transactionReference: '351233'
      }),
      expectedFormatErrors: [new FormatError('Mutation')]
    });
  });

  it('should throw error if description is empty string', () => {
    expectValidationErrorToBeThrown({
      callback: () => processRawCustomerStatementRecord({
        accountNumber: 'NL89ABNA1234123412',
        description: '',
        endBalance: '321',
        mutation: '+21.241',
        startBalance: '12321',
        transactionReference: '351233'
      }),
      expectedFormatErrors: [new FormatError('Description')]
    });
  });

  it('should return a `CustomerStatementRecord` if validation passes', () => {
    expect(processRawCustomerStatementRecord({
      accountNumber: 'NL89ABNA1234123412',
      description: 'asd',
      endBalance: '321',
      mutation: '+21.241',
      startBalance: '12321',
      transactionReference: '351233'
    })).toEqual({
      accountNumber: 'NL89ABNA1234123412',
      description: 'asd',
      endBalance: 321,
      mutation: '+21.241',
      startBalance: 12321,
      transactionReference: '351233'
    });
  });
});
