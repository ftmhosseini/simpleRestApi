import express from 'express'
// const express = require('express')

import {getExpenses, getExpense,postExpense, putExpense, deleteExpense} from '../controllers/expenseController.js'
const ExpenseRouter = express.Router()

ExpenseRouter.get('/',getExpenses)
ExpenseRouter.get('/:id',getExpense)
ExpenseRouter.post('/',postExpense)
ExpenseRouter.put('/:id',putExpense)
ExpenseRouter.delete('/:id',deleteExpense)

export default ExpenseRouter;