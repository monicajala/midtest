const express = require("express");

const transactionsControllers = require("./transactions-controller");

const route = express.Router();

module.exports = (app) => {
  app.use("/transactions", route);

  route.get("/", transactionsControllers.getTransactions);

  route.post("/", transactionsControllers.createTransaction);

  route.get("/:id", transactionsControllers.getTransaction);

  route.put(
    "/:id",

    transactionsControllers.updateTransaction
  );

  route.delete(
    "/:id",

    transactionsControllers.deleteTransaction
  );
};
