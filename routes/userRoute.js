import express from 'express'
// const express = require('express')
// Note: Using ES Modules (import) instead of CommonJS (require) for modern syntax
import {getUser, getUsers,postUser, putUser, deleteUser} from '../controllers/userController.js'

/** * User Router
 * Handles all requests directed to /api/users
 */
const userRouter = express.Router()
/**
 * @route   GET /api/users
 * @desc    Retrieve a list of all users
 */
userRouter.get('/',getUsers)
/**
 * @route   GET /api/users/:id
 * @desc    Get details for a single user by their unique ID
 */
userRouter.get('/:id',getUser)
/**
 * @route   POST /api/users
 * @desc    Register or create a new user
 */
userRouter.post('/',postUser)
/**
 * @route   PUT /api/users/:id
 * @desc    Update an existing user's full profile
 */
userRouter.put('/:id',putUser)
/**
 * @route   DELETE /api/users/:id
 * @desc    Remove a user from the system
 */
userRouter.delete('/:id',deleteUser)

export default userRouter;
