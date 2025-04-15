// Double-Entry Accounting (JavaScript)

class Ledger {
  constructor() {
    this.entries = [];
  }

  debit(account, amount) {
    this.entries.push({ account, amount, type: 'DEBIT' });
  }

  credit(account, amount) {
    this.entries.push({ account, amount, type: 'CREDIT' });
  }

  getEntries() {
    return this.entries;
  }
}

// Example usage
const ledger = new Ledger();
ledger.debit('Cash', 1000);
ledger.credit('Revenue', 1000);
console.log(ledger.getEntries());
