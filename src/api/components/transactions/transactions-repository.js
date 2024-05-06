const { Transaction } = require("../../../models");

async function getTransactions() {
  return await Transaction.find({});
}

async function getTransaction(account_number) {
  return Transaction.find({ account_number: account_number });
}

async function createTransaction(account_number, name) {
  const balance = 0;
  return Transaction.create({
    account_number,
    name,
    balance,
  });
}

async function updateTransaction(account_number, balance) {
  return Transaction.updateOne(
    {
      account_number: account_number,
    },
    {
      $set: {
        balance,
      },
    }
  );
}

async function deleteTransaction(account_number) {
  return Transaction.deleteOne({ account_number: account_number });
}

module.exports = {
  getTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};
