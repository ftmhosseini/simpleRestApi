import express from 'express'
// const express = require('express')
// Note: Using ES Modules (import) instead of CommonJS (require) for modern syntax
import {getAllIncome, getIncome,postIncome, putIncome, deleteIncome} from '../controllers/incomeController.js'

/** * Income Router
 * Handles all requests directed to /api/income
 */
const incomeRouter = express.Router()
/**
 * @route   GET /api/income
 * @desc    Retrieve a list of all income
 */
incomeRouter.get('/',getAllIncome)
/**
* @route   GET /api/income/:id
 * @desc    Get details for a single income by their unique ID
 */
incomeRouter.get('/:id',getIncome)
/**
 * @route   POST /api/income
 * @desc    Register or create a new income
 */
incomeRouter.post('/',postIncome)
/**
 * @route   PUT /api/income/:id
 * @desc    Update an existing income
 */
incomeRouter.put('/:id',putIncome)
/**
 * @route   DELETE /api/income/:id
 * @desc    Remove a income from the system
 */
incomeRouter.delete('/:id',deleteIncome)

export default incomeRouter;