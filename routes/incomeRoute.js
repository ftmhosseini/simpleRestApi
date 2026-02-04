import express from 'express'
// const express = require('express')

import {getAllIncome, getIncome,postIncome, putIncome, deleteIncome} from '../controllers/incomeController.js'
const incomeRouter = express.Router()

incomeRouter.get('/',getAllIncome)
incomeRouter.get('/:id',getIncome)
incomeRouter.post('/',postIncome)
incomeRouter.put('/:id',putIncome)
incomeRouter.delete('/:id',deleteIncome)

export default incomeRouter;