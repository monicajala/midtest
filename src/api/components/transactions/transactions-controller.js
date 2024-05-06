const transactionsService = require("./transactions-service");
const { errorResponder, errorTypes } = require("../errors");

async function getTransactions(request, response, next) {
  try {
    const transactions = await transactionsService.getTransactions();

    return response.status(200).json(transactions);
  } catch (error) {
    return next(error);
  }
}

async function getTransaction(request, response, next) {
  try {
    const transaction = await transactionsService.getTransaction(
      request.query.account_number
    );
    const pin = request.query.pin;

    const isValidPin = await transactionsService.checkValidPin(
      request.query.account_number,
      pin
    );

    if (!isValidPin) {
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, "Wrong PIN");
    }

    if (!transaction) {
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, "Unknown account");
    }

    return response.status(200).json(transaction);
  } catch (error) {
    return next(error);
  }
}

async function createTransaction(request, response, next) {
  try {
    const account_number = request.body.account_number;
    const name = request.body.name;
    const pin = request.body.pin;

    const success = await transactionsService.createTransaction(
      account_number,
      name,
      pin
    );
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        "Failed to create account"
      );
    }

    return response.status(200).json(success);
  } catch (error) {
    return next(error);
  }
}

async function updateTransaction(request, response, next) {
  try {
    const account_number = request.body.account_number;
    const balance = request.body.balance;
    const pin = request.body.pin;

    const isValidPin = await transactionsService.checkValidPin(
      account_number,
      pin
    );

    if (!isValidPin) {
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, "Wrong PIN");
    }

    const success = await transactionsService.updateTransaction(
      account_number,
      balance
    );
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        "Failed to update transaction"
      );
    }

    return response.status(200).json({ account_number });
  } catch (error) {
    return next(error);
  }
}

async function deleteTransaction(request, response, next) {
  try {
    const account_number = request.params.id;
    const pin = request.body.pin;

    const isValidPin = await transactionsService.checkValidPin(
      account_number,
      pin
    );

    if (!isValidPin) {
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, "Wrong PIN");
    }

    const success = await transactionsService.deleteTransaction(account_number);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        "Failed to delete account"
      );
    }

    return response.status(200).json({ account_number });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};
