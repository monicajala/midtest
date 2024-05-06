const transactionsRepository = require("./transactions-repository");

async function getTransactions() {
  const transactions = await transactionsRepository.getTransactions();

  return transactions;
}

async function getTransaction(account_number) {
  const transaction = await transactionsRepository.getTransaction(
    account_number
  );

  if (!transaction) {
    return null;
  }

  return {
    account_number: transaction.account_number,
    name: transaction.name,
    balance: transaction.balance,
  };
}

async function checkValidPin(account_number, pin) {
  const transaction = await transactionsRepository.getTransaction(
    account_number
  );

  if (!transaction) {
    return null;
  }

  if (pin !== transaction.pin) {
    return null;
  }

  return true;
}

async function createTransaction(account_number, name, balance) {
  try {
    return await transactionsRepository.createTransaction(
      account_number,
      name,
      balance
    );
  } catch (err) {
    return null;
  }
}

async function updateTransaction(account_number, balance) {
  const transaction = await transactionsRepository.getTransaction(
    account_number,
    balance
  );

  if (!transaction) {
    return null;
  }

  try {
    await transactionsRepository.updateTransaction(account_number, balance);
  } catch (err) {
    return null;
  }

  return true;
}

async function deleteTransaction(account_number) {
  const transaction = await transactionsRepository.getTransaction(
    account_number
  );

  if (!transaction) {
    return null;
  }

  try {
    await transactionsRepository.deleteTransaction(account_number);
  } catch (err) {
    return null;
  }

  return true;
}

module.exports = {
  getTransactions,
  getTransaction,
  checkValidPin,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};
