const DIGIT_AMOUNT_IN_REFERENCE = 6;

export class TransactionReferenceUniquenessChecker {
  private digitHistory = new Set<string>();

  public checkUnique(reference: string): boolean {
    this.validateReferenceFormat(reference);
    
    if (!this.digitHistory.has(reference)) {
      this.digitHistory.add(reference);
      return true;
    }

    return false;
  }

  private validateReferenceFormat(reference: string): void {
    if (reference.length !== DIGIT_AMOUNT_IN_REFERENCE) throw new Error();

    if (Number.isNaN(+reference)) throw new Error();
  }
}
