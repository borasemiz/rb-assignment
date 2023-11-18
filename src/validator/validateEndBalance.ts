import type { CustomerStatementRecord } from '@/model/CustomerStatementRecord';

export function validateEndBalance({ endBalance, startBalance, mutation }: CustomerStatementRecord): boolean {
  const sign = mutation.charAt(0) === '-' ? -1 : 1;
  const mutationMagnitude = +mutation.slice(1)

  const endBalanceInInteger = Math.floor(endBalance * 100);
  const startBalanceInInteger = Math.floor(startBalance * 100);
  const mutationInInteger = sign * Math.floor(mutationMagnitude * 100);

  const expectedEndBalance = startBalanceInInteger + mutationInInteger;

  return endBalanceInInteger === expectedEndBalance;
}