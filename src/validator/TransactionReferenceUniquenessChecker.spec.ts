import { TransactionReferenceUniquenessChecker } from './TransactionReferenceUniquenessChecker';

describe('TransactionReferenceValidator tests', () => {
  it('`checkUnique` method should return `true` if a unique reference is provided', () => {
    const validator = new TransactionReferenceUniquenessChecker();

    validator.checkUnique('123456');
    validator.checkUnique('321421');
    validator.checkUnique('325121');
    expect(validator.checkUnique('123457')).toBe(true);
  });

  it('`checkUnique` method should return `false` if a non-unique reference is provided', () => {
    const validator = new TransactionReferenceUniquenessChecker();

    validator.checkUnique('123456');
    validator.checkUnique('321456');
    expect(validator.checkUnique('123456')).toBe(false);
  });

  /** Run this test only if you have some time to kill. */
  it.skip('`checkUnique` method should return true for all the references from 000000 to 999999', () => {
    const checker = new TransactionReferenceUniquenessChecker();

    for (let reference = 0; reference < 999999; reference++) {
      expect(checker.checkUnique(reference.toString().padStart(6, '0'))).toBe(true);
    }
  });

  it('`checkUnique` should throw if the provided reference is not 6 characters', () => {
    const validator = new TransactionReferenceUniquenessChecker();

    expect(() => validator.checkUnique('1234567')).toThrow();
    expect(() => validator.checkUnique('123')).toThrow();
  });

  it('`checkUnique` should throw if the provided reference contains non-digit characters', () => {
    const validator = new TransactionReferenceUniquenessChecker();

    expect(() => validator.checkUnique('12bds5')).toThrow();
  });
});