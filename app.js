// Initial blank array for expenses
let expenses = [];

// When the page loads, only show the initial request for monthly income
window.onload = function () {
    document.getElementById('budgetDetails').style.display = 'none';
    document.getElementById('actualBudgetSection').style.display = 'none';
};

// Function to collect monthly income, update to show the next steps, and set ideal budget values
document.getElementById('setTotal').onclick = function () {
    const totalIncome = document.getElementById('totalIncome').value;

    if (totalIncome) {
        document.getElementById('initialSet').style.display = 'none';
        document.getElementById('budgetDetails').style.display = 'block';

        // Calculate and set the budget values
        document.getElementById('billBudget').value = (totalIncome * 0.5).toFixed(2);
        document.getElementById('funBudget').value = (totalIncome * 0.3).toFixed(2);
        document.getElementById('savingsBudget').value = (totalIncome * 0.2).toFixed(2);
    } else {
        alert("Please enter your monthly income.");
    }
};

// Function to submit each new expense
function submitExpense() {
    const expenseName = document.getElementById('expenseName').value;
    const expenseAmount = document.getElementById('expenseAmount').value;
    const expenseType = document.getElementById('expenseType').value;

    // Create a new object
    const newExpense = {
        name: expenseName,
        amount: expenseAmount,
        type: expenseType
    };

    // Add the new expense to the array
    expenses.push(newExpense);

    // Clear input fields for reuse
    document.getElementById('expenseName').value = '';
    document.getElementById('expenseAmount').value = '';
    document.getElementById('expenseType').value = 'Bills';

    // Render the updated expenses list
    renderExpensesList();
}

// Function to render the list of expenses
function renderExpensesList() {
    const expensesListDiv = document.getElementById('expensesList');

    // Clear any existing content
    expensesListDiv.innerHTML = '';

    // Loop through each expense and create a div for it
    expenses.forEach((expense, index) => {
        const expenseDiv = document.createElement('div');
        expenseDiv.innerHTML = `
            <div class="expenseProvided">
            <p class="inputBillName"><span id="name-${index}">${expense.name}</span></p>
            <p class="inputBillAmount">$<span id="amount-${index}">${expense.amount}</span></p>
            <p class="inputBillType"><span id="type-${index}">${expense.type}</span></p>
            <button class="inputBillEdit" id="edit-button-${index}" onclick="editExpense(${index})">Edit</button>
            <button class="inputBillDelete" onclick="deleteExpense(${index})">Delete</button>
            </div>
        `;
        expensesListDiv.appendChild(expenseDiv);
    });
}

// Function to edit an expense
function editExpense(index) {
    const expense = expenses[index];

    // Create input fields for the current set values
    const nameField = `<input class="editBillName" type="text" id="edit-name-${index}" value="${expense.name}">`;
    const amountField = `<input class="editBillAmount" type="number" id="edit-amount-${index}" value="${expense.amount}">`;
    const typeField = `
        <select class="editBillType" id="edit-type-${index}">
            <option value="Bills" ${expense.type === 'Bills' ? 'selected' : ''}>Bills</option>
            <option value="Fun" ${expense.type === 'Fun' ? 'selected' : ''}>Fun</option>
            <option value="Savings" ${expense.type === 'Savings' ? 'selected' : ''}>Savings</option>
        </select>
    `;

    // Replace the current values with input fields
    document.getElementById(`name-${index}`).parentElement.innerHTML = `${nameField}`;
    document.getElementById(`amount-${index}`).parentElement.innerHTML = `${amountField}`;
    document.getElementById(`type-${index}`).parentElement.innerHTML = `${typeField}`;

    // Update the Edit button to a Save button
    const editButton = document.getElementById(`edit-button-${index}`);
    editButton.innerText = 'Save';
    editButton.onclick = function () { saveExpense(index); };
}

// Function to save an edited expense
function saveExpense(index) {
    const editedName = document.getElementById(`edit-name-${index}`).value;
    const editedAmount = document.getElementById(`edit-amount-${index}`).value;
    const editedType = document.getElementById(`edit-type-${index}`).value;

    // Update the expense in the array
    expenses[index] = {
        name: editedName,
        amount: editedAmount,
        type: editedType
    };

    // Render the updated expenses list
    renderExpensesList();
}

// Function to delete an expense
function deleteExpense(index) {
    // Remove the expense from the array
    expenses.splice(index, 1);

    // Render the updated expenses list
    renderExpensesList();
}

// Function to calculate the actual budget breakdown
function actualBudgetBreakdown() {
    const totalIncome = document.getElementById('totalIncome').value;

    let totalBills = 0;
    let totalFun = 0;
    let totalSavings = 0;

    // Calculate total expenses for each type of expense
    expenses.forEach(expense => {
        if (expense.type === 'Bills') {
            totalBills += parseFloat(expense.amount);
        } else if (expense.type === 'Fun') {
            totalFun += parseFloat(expense.amount);
        } else if (expense.type === 'Savings') {
            totalSavings += parseFloat(expense.amount);
        }
    });

    // Add any remaining income to savings
    const remainingIncome = totalIncome - (totalBills + totalFun + totalSavings);
    if (remainingIncome > 0) {
        totalSavings += remainingIncome;
    }

    // Update the actual budget values
    document.getElementById('billBudgetActual').value = totalBills.toFixed(2);
    document.getElementById('funBudgetActual').value = totalFun.toFixed(2);
    document.getElementById('savingsBudgetActual').value = totalSavings.toFixed(2);

    // Update percentages for each segment
    document.querySelector('label[for="billBudgetActual"]').innerText = `Bills (${((totalBills / totalIncome) * 100).toFixed(0)}%)`;
    document.querySelector('label[for="funBudgetActual"]').innerText = `Fun (${((totalFun / totalIncome) * 100).toFixed(0)}%)`;
    document.querySelector('label[for="savingsBudgetActual"]').innerText = `Savings (${((totalSavings / totalIncome) * 100).toFixed(0)}%)`;

    // Show the actual budget section and hide the expense input section
    document.getElementById('actualBudgetSection').style.display = 'block';
    document.getElementById('expenseSection').style.display = 'none';
}

// Function to go back to the previous menu
function goBack() {
    // Show the expense input section and hide the actual budget section
    document.getElementById('expenseSection').style.display = 'block';
    document.getElementById('actualBudgetSection').style.display = 'none';
}
