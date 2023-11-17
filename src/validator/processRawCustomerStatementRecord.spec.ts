import { processRawCustomerStatementRecord } from './processRawCustomerStatementRecord';

describe('processRawCustomerStatementRecord tests', () => {
  it('should throw validation error any of the fields are not present', () => {
    expect(() => processRawCustomerStatementRecord({})).toThrow();
  });

  it('should throw error if transaction reference is not made up of numbers', () => {
    expect(() => processRawCustomerStatementRecord({
      accountNumber: 'NL89ABNA1234123412',
      description: 'qweqwe',
      endBalance: '321',
      mutation: '+21',
      startBalance: '123',
      transactionReference: '3d1123'
    })).toThrow();
  });

  it('should throw error if transaction reference is not made up of 6 characters', () => {
    expect(() => processRawCustomerStatementRecord({
      accountNumber: 'NL89ABNA1234123412',
      description: 'qweqwe',
      endBalance: '321',
      mutation: '+21',
      startBalance: '123',
      transactionReference: '35123'
    })).toThrow();
  });

  it('should throw error if the account number is not in correct format', () => {
    expect(() => processRawCustomerStatementRecord({
      accountNumber: 'NL89ABNA1233412',
      description: 'qweqwe',
      endBalance: '321',
      mutation: '+21',
      startBalance: '123',
      transactionReference: '351233'
    })).toThrow();
  });

  it('should throw error if start balance is not a number', () => {
    expect(() => processRawCustomerStatementRecord({
      accountNumber: 'NL89ABNA1234123412',
      description: 'qweqwe',
      endBalance: '321',
      mutation: '+21',
      startBalance: '12a321',
      transactionReference: '351233'
    })).toThrow();
  });

  it('should throw error if end balance is not a number', () => {
    expect(() => processRawCustomerStatementRecord({
      accountNumber: 'NL89ABNA1234123412',
      description: 'qweqwe',
      endBalance: '32f1',
      mutation: '+21',
      startBalance: '12321',
      transactionReference: '351233'
    })).toThrow();
  });

  it('should throw error if mutation doesn\'t start with either "-" or "+"', () => {
    expect(() => processRawCustomerStatementRecord({
      accountNumber: 'NL89ABNA1234123412',
      description: 'qweqwe',
      endBalance: '321',
      mutation: '21',
      startBalance: '12321',
      transactionReference: '351233'
    })).toThrow();
  });

  it('should throw error if mutation is not a number after the sign', () => {
    expect(() => processRawCustomerStatementRecord({
      accountNumber: 'NL89ABNA1234123412',
      description: 'qweqwe',
      endBalance: '321',
      mutation: '+21.241wq',
      startBalance: '12321',
      transactionReference: '351233'
    })).toThrow();
  });

  it('should throw error if description is empty string', () => {
    expect(() => processRawCustomerStatementRecord({
      accountNumber: 'NL89ABNA1234123412',
      description: '',
      endBalance: '321',
      mutation: '+21.241',
      startBalance: '12321',
      transactionReference: '351233'
    })).toThrow();
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
