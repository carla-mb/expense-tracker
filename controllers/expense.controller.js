/**
 * @class Controller
 *
 * Links the user input and the view output.
 *
 * @param model
 * @param view
 */
class TransactionController {
    constructor(service, view) {
        this.service = service;
        this.view = view;

        // Explicit this binding
        this.service.bindtransactionListChanged(this.ontransactionListChanged);
        this.view.bindAddTransaction(this.handleAddTransaction);
        this.view.bindEditTransaction(this.handleEditTransaction);
        this.view.bindRemoveTransaction(this.handleRemoveTransaction);

        // Display initial transactions
        this.ontransactionListChanged(this.service.transactions);
    }

    ontransactionListChanged = transactions => {
        // Calculate balance, income, and expenses
        const amounts = transactions.map(transaction => transaction.amount);
        const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
        const income = amounts.filter(item => item > 0).reduce((acc, item) => (acc += item), 0).toFixed(2);
        const expense = (amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1).toFixed(2);

        // Update balance, income, and expenses in the view
        this.view.updateBalanceDisplay(total, income, expense);

        // Update transaction list in the view
        this.view.addTransactionDOM(transactions);
    };

    handleAddTransaction = (inputText, inputAmount) => {
        this.service.addTransaction(inputText, inputAmount);
    };

    handleEditTransaction = (id, inputText, inputAmount) => {
        this.service.editTransaction(id, inputText, inputAmount);
    };

    handleRemoveTransaction = id => {
        this.service.removeTransaction(id);
    };
}