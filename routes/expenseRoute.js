import express from 'express'
// const express = require('express')
// Note: Using ES Modules (import) instead of CommonJS (require) for modern syntax
import {getExpenses, getExpense,postExpense, putExpense, deleteExpense} from '../controllers/expenseController.js'

/** * Expences Router
 * Handles all requests directed to /api/expenses
 */
const expenseRouter = express.Router()
/**
 * @route   GET /api/expenses
 * @desc    Retrieve a list of all expenses
 */
expenseRouter.get('/',getExpenses)
/**
 * @route   GET /api/expenses/:id
 * @desc    Get details for a single expenses by their unique ID
 */
expenseRouter.get('/:id',getExpense)
/**
 * @route   POST /api/expenses
 * @desc    Register or create a new expense
 */
expenseRouter.post('/',postExpense)
/**
 * @route   PUT /api/expenses/:id
 * @desc    Update an existing expense
 */
expenseRouter.put('/:id',putExpense)
/**
 * @route   DELETE /api/expenses/:id
 * @desc    Remove a expense from the system
 */
expenseRouter.delete('/:id',deleteExpense)

export default expenseRouter;