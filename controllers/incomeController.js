/**
 * Income Controller
 * Handles CRUD operations for Income records using Firebase Realtime Database.
 */
import { db } from '../config/config.js'
import { ref, get, update, set, remove, runTransaction } from 'firebase/database'
import { Income } from '../models/Income.js'
import { Expense } from '../models/Expense.js'
const node = '/income/'

/**
 * @route   GET /api/income
 * @desc    Fetch all income records from the database
 * @access  Public
 */
export const getAllIncome = async (req, res) => {
    try {
        const snapshot = await get(ref(db, node));

        if (snapshot.exists()) {
            // Return the actual data inside the snapshot
            res.status(200).json(snapshot.val());
        } else {
            // It's technically successful (the DB was reached), 
            // but the collection is empty.
            res.status(200).json([]);
        }
    } catch (error) {
        // This catches "Database Errors" (Requirement 3a)
        console.error("Error fetching Income:", error);
        res.status(500).json({
            error: "Internal Server Error",
            message: "Could not retrieve Income from the database."
        });
    }
}

/**
 * @route   GET /api/income/:id
 * @desc    Fetch a specific income record by its ID
 */
export const getIncome = async (req, res) => {
    try {
        const snapshot = await get(ref(db, node + req.params.id));
        if (snapshot.exists()) {
            res.status(200).json(snapshot.val()); // Use .json() for consistency
        } else {
            res.status(404).json({ error: "Not Found", message: "Income not found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Server Error", message: error.message });
    }
}
/**
 * @route   PUT /api/income/:id
 * @desc    Update an existing income record (merges new data with existing data)
 */
export const putIncome = async (req, res) => {
    try {
        const incomeRef = ref(db, node + req.params.id)
        const snapshot = await get(incomeRef)
        if (!snapshot.exists()) {
            res.status(404).json({
                error: "Not Found",
                message: `Income with ID ${req.params.id} does not exist.`
            });
        } else {
            const existingData = snapshot.val();
            req.body = Expense.lowercaseKeys(req.body)

            const mergedData = {
                wages: req.body['wages'] || existingData['wages'],
                secondaryIncome: req.body['secondary income'] || existingData['secondary income'],
                interest: req.body['interest'] || existingData['interest'],
                supportPayment: req.body['support payment'] || existingData['support payment'],
                others: req.body['others'] || existingData['others']
            };
            Object.keys(mergedData).forEach((item) => {
                if (mergedData[item] === undefined)
                    delete mergedData[item]
            })

            await update(incomeRef, { ...mergedData })
            res.status(200).send({ id: req.params.id, message: "Income updated" });
        }
    } catch (error) {
        res.status(500).send(error.message);

    }
}
/**
 * @route   POST /api/income/:id
 * @desc    Create a new income record with an auto-incrementing ID
 */
export const postIncome = async (req, res) => {
    try {
        req.body = Expense.lowercaseKeys(req.body);

        const newIncome = new Income(req.body);
        Income.validate(req.body)

        const counterRef = ref(db, 'lastIncomeId');
        const result = await runTransaction(counterRef, (currentValue) => {
            if (currentValue === null) {
                return 100;
            }
            return currentValue + 1;
        });
        const newId = result.snapshot.val();
        await set(ref(db, node + newId), { ...newIncome })
        res.status(201).send({ id: newId, message: "Income created" });
    } catch (error) {
        res.status(500).send(`${error.message}`);
    }

}
/**
 * @route   DELETE /api/income/:id
 * @desc    Remove an income record from the database
 */
export const deleteIncome = async (req, res) => {
    try {
        const incomeId = req.params.id;

        if (!incomeId) {
            return res.status(400).send("Income ID is required");
        }
        const incomeRef = ref(db, node + incomeId)
        const snapshot = await get(incomeRef)
        if (!snapshot.exists()) {
            res.status(404).json({
                error: "Not Found",
                message: `Income with ID ${incomeId} does not exist.`
            });
        }
        await remove(incomeRef)
        res.status(204).send({ id: incomeId, message: "Income Deleted" });
    } catch (error) {
        res.status(500).send(`${error.message}`);
    }
}