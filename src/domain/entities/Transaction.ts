import { StatusTransactionEnum } from '../enums/status-transaction.enum';

export class Transaction {
  private LIMIT_MAX_TRANZACTION = 10000;

  private status: StatusTransactionEnum = StatusTransactionEnum.ACCEPTED;
  private rejection_reason: string = '';

  constructor(
    private transaction_id?: string,
    private account_id?: string,
    private amount?: number,
    private transaction_type?: string,
    private timestamp?: Date,
  ) {
    if (this.validate()) {
      this.evaluateRisk();
    }
  }

  validate(): boolean {
    if (!this.transaction_id || !this.account_id) {
      this.status = StatusTransactionEnum.REJECTED;
      this.rejection_reason = 'Corrupted transaction: Missing string fields';
      return false;
    }
    if (this.amount !== 0 && !this.amount) {
      this.status = StatusTransactionEnum.REJECTED;
      this.rejection_reason = 'Corrupted transaction: Invalid amount';
      return false;
    }
    if (!this.timestamp) {
      this.status = StatusTransactionEnum.REJECTED;
      this.rejection_reason = 'Corrupted transaction: Invalid timestamp';
      return false;
    }
    return true;
  }

  private evaluateRisk(): void {
    if (this.amount! < this.LIMIT_MAX_TRANZACTION) return;

    this.status = StatusTransactionEnum.REJECTED;
    this.rejection_reason = 'Big amount in transaction';
  }
  isApproved(): boolean {
    return this.status == StatusTransactionEnum.ACCEPTED;
  }

  getTransaction_id(): string {
    return this.transaction_id || '';
  }

  getAccount_id(): string {
    return this.account_id || '';
  }

  getAmount(): number {
    return this.amount || 0;
  }

  getTransaction_type(): string {
    return this.transaction_type || '';
  }

  getRejection_reason(): string {
    return this.rejection_reason;
  }

  getTimestamp(): string {
    return this.timestamp ? this.timestamp.toISOString() : '';
  }
}
