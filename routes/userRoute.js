import express from 'express'
// const express = require('express')
import {getUser, getUsers,postUser, putUser, deleteUser} from '../controllers/userController.js'
const userRouter = express.Router()

userRouter.get('/',getUsers)
userRouter.get('/:id',getUser)
userRouter.post('/',postUser)
userRouter.put('/:id',putUser)
userRouter.delete('/:id',deleteUser)

export default userRouter;
