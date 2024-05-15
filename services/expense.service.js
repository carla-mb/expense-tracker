  /**
   * @class Service
   *
   * Manages the data of the application.
   */
  class TransactionService {
    constructor() {
      this.transactions = (JSON.parse(localStorage.getItem("transactions")) || []).map(
        transaction => new Transaction(transaction)
      );
    }
  
    bindtransactionListChanged(callback) {
      this.ontransactionListChanged = callback;
    }
  
    _commit(transactions) {
      this.ontransactionListChanged(transactions);
      localStorage.setItem("transactions", JSON.stringify(transactions));
    }
  
    addTransaction(text, amount) {
      this.transactions.push(new Transaction({ text, amount }));
  
      this._commit(this.transactions);
    }
  
    editTransaction(id, updatedText, updatedAmount) {
      this.transactions = this.transactions.map(transaction =>
        transaction.id === id
          ? new Transaction({
              ...transaction,
              text: updatedText,
              amount: updatedAmount
            })
          : transaction
      );
  
      this._commit(this.transactions);
    }
  
    removeTransaction(_id) {
      this.transactions = this.transactions.filter(({ id }) => id !== _id);
  
      this._commit(this.transactions);
    }
  }