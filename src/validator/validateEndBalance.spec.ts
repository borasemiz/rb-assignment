import { validateEndBalance } from "./validateEndBalance";

describe('validateEndBalance tests', () => {
  it('should return false if the `endBalance` doesn\'t match `startBalance` + `mutation`', () => {
    expect(
      validateEndBalance({
        accountNumber: 'qwe',
        endBalance: 321,
        mutation: '+25',
        startBalance: 123,
        transactionReference: '123312'
      })
    ).toBe(false);
  });

  it('should return true if the `endBalance` matches `startBalance` + `mutation`', () => {
    expect(
      validateEndBalance({
        accountNumber: 'qwe',
        endBalance: 321,
        mutation: '-25',
        startBalance: 346,
        transactionReference: '123312'
      })
    ).toBe(true);
  });

  it('should return true if the `endBalance` matches `startBalance` + `mutation`, and if `mutation` is 0', () => {
    expect(
      validateEndBalance({
        accountNumber: 'qwe',
        endBalance: 321,
        mutation: '0',
        startBalance: 321,
        transactionReference: '123312'
      })
    ).toBe(true);
  });

  it('should return false if the `endBalance` doesn\'t matches `startBalance` + `mutation`, and if `mutation` is 0', () => {
    expect(
      validateEndBalance({
        accountNumber: 'qwe',
        endBalance: 321,
        mutation: '0',
        startBalance: 326,
        transactionReference: '123312'
      })
    ).toBe(false);
  });
});
