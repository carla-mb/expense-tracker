/**
 * @class View
 *
 * Visual representation of the model.
 */
class TransactionView {
    constructor() {
      this.app = this.getElement("#root");
      this.title = this.createElement("h2");
      this.title.textContent = "Expense Tracker";
  
      this.container = this.createElement("div", "container");
  
      this.balanceTitle = this.createElement("h4");
      this.balanceTitle.textContent = "Your balance";
  
      this.balanceAmount = this.createElement("h1", "", "balance");
      this.balanceAmount.textContent = "$0.00";
  
      // Income - Expense container
      this.incExpContainer = this.createElement("div", "inc-exp-container");
      // Income div
      this.incomeDiv = this.createElement("div");
      this.incomeTitle = this.createElement("h4");
      this.incomeTitle.textContent = "Income";
      this.moneyPlus = this.createElement("p", "money-plus", "money-plus");
      this.moneyPlus.textContent = "+$0.00";
      this.incomeDiv.append(this.incomeTitle, this.moneyPlus);
      // Expenses div
      this.expenseDiv = this.createElement("div");
      this.expenseTitle = this.createElement("h4");
      this.expenseTitle.textContent = "Expense";
      this.moneyMinus = this.createElement("p", "money-minus", "money-minus");
      this.moneyMinus.textContent = "-$0.00";
      this.expenseDiv.append(this.expenseTitle, this.moneyMinus);
      
      this.incExpContainer.append(this.incomeDiv, this.expenseDiv);
  
      this.history = this.createElement("h3");
      this.history.textContent = "History";
  
      this.transactionList = this.createElement("ul", "list", "list");
  
      this.addTransactionTitle = this.createElement("h3");
      this.addTransactionTitle.textContent = "Add new transaction";
  
      // Form content
      this.transactionForm = this.createElement("form", "", "form");
      this.textDiv = this.createElement("div", "form-control");
      this.amountDiv = this.createElement("div", "form-control");
      this.textLabel = this.createElement("label");
      this.textLabel.textContent = "Text";
      this.textInput = this.createElement("input");
      this.textInput.type = "text";
      this.textInput.id = "text";
      this.textInput.placeholder = "Enter text...";
      this.amountLabel = this.createElement("label");
      this.amountLabel.textContent = "Amount";
      this.amountLabel.innerHTML += "<br />(negative - expense, positive - income)";
      this.amountInput = this.createElement("input");
      this.amountInput.type = "number";
      this.amountInput.id = "amount";
      this.amountInput.placeholder = "Enter amount...";
      this.addButton = this.createElement("button", "btn");
      this.addButton.textContent = "Add transaction";
  
      this.textDiv.append(this.textLabel, this.textInput);
      this.amountDiv.append(this.amountLabel, this.amountInput);
      this.transactionForm.append(this.textDiv, this.amountDiv, this.addButton);
  
      this.container.append(this.balanceTitle, this.balanceAmount, this.incExpContainer, 
                            this.history, this.transactionList, this.addTransactionTitle, 
                            this.transactionForm);
  
      this.app.append(this.title, this.container);
  
      // Initialize temporary text and amount variables to be able to edit
      this._temporaryTransactionText = ""; 
      this._temporaryTransactionAmount = 0; 
      this._initLocalListeners();
    }
  
    _resetInput() {
      this.textInput.value = "";
      this.amountInput.value = "";
    }
  
    // Helper to create initial DOM elments on constructor
    createElement(tag, className, id) {
      const element = document.createElement(tag);
  
      if (className) element.classList.add(className);
      if (id) element.id = id;
  
      return element;
    }
  
    getElement(selector) {
      const element = document.querySelector(selector);
  
      return element;
    }
  
    // Add transactions to DOM list
    addTransactionDOM(transactions) {
      /* Clear transactionList to avoid duplicate transactions 
      being displayed when calling addTransactionDOM multiple times */
      this.transactionList.innerHTML = '';
      
      transactions.forEach(transaction => {
        const sign = transaction.amount < 0 ? '-' : '+';
        const item = document.createElement('li');
       
        // Set id of the <li> to transaction id and also assign it to the dataset for easy access
        item.id = item.dataset.id = transaction.id;
        // Add class based on positive/negative value
        item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');
        // Allow <li> to be editable by user
        item.contentEditable = true;
        item.classList.add("editable");
  
        const deleteButton = this.createElement("button", "delete-btn");
        deleteButton.textContent = "x";
  
        // Content of the <li>
        item.innerHTML = `${transaction.text} <span>${sign}${Math.abs(transaction.amount)}</span>`;
  
        item.append(deleteButton);
  
        // Add <li> to transactionList (<ul>)
        this.transactionList.appendChild(item);
      });
      // Debugging
      console.log(transactions);
    }
  
    // Update the balance, income, and expenses display
    updateBalanceDisplay(total, income, expense) {
      this.balanceAmount.textContent = `$${total}`;
      this.moneyPlus.textContent = `$${income}`;
      this.moneyMinus.textContent = `$${expense}`;
    }
  
    // Initializes local listeners for the transaction list
    _initLocalListeners() {
      this.transactionList.addEventListener("input", event => {
        if (event.target.className === "editable") {
          // Update temporary text and amount when input event occurs
          this._temporaryTransactionText = event.target.innerText;
          this._temporaryTransactionAmount = parseFloat(event.target.innerText);
        } 
      });
    }
  
    // Handler for adding transaction
    bindAddTransaction(handler) {
      this.transactionForm.addEventListener("submit", event => {
        event.preventDefault();
        // Extract input and amount values and clean
        const textInputValue = this.textInput.value.trim();
        const amountInputValue = parseFloat(this.amountInput.value.trim());
        // Check that none are empty
        if (textInputValue && amountInputValue) {
            handler(textInputValue, amountInputValue);
            // Reset input fields after adding
            this._resetInput();
        }
      });
    }
  
    // Handler for removing transaction
    bindRemoveTransaction(handler) {
      this.transactionList.addEventListener("click", event => {
        if (event.target.className === "delete-btn") {
          // Get transaction id
          const id = event.target.parentElement.dataset.id;
          handler(id); 
        }
      });
    }
  
    // Handler for editing transaction
    bindEditTransaction(handler) {
      this.transactionList.addEventListener("focusout", event => {
        if (event.target.classList.contains('editable')) {
          // Get the parent element (li) which contains dataset id
          const listItem = event.target.closest('li');
          const id = listItem.dataset.id;
          // Extract text and amount
          const text = listItem.childNodes[0].textContent.trim();
          const amount = listItem.childNodes[1].textContent.trim();
          // Extract numeric amount from 'amount' and match regex
          const numericAmount = parseFloat(amount.match(/[-+]?\d*\.?\d+/)[0]);
          handler(id, text, numericAmount);
        }
      });
    }
}