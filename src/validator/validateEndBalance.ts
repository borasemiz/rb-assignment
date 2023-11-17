import type { CustomerStatementRecord } from '@/model/CustomerStatementRecord';

export function validateEndBalance({ endBalance, startBalance, mutation }: CustomerStatementRecord): boolean {
  const sign = mutation.charAt(0) === '-' ? -1 : 1;
  const mutationMagnitude = +mutation.slice(1)

  return endBalance === startBalance + sign * mutationMagnitude;
}