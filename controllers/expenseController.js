/**
 * Expense Controller
 * Manages complex, nested expense data within the Firebase Realtime Database.
 * Features deep-merging for updates and atomic ID generation.
 */
import { db } from '../config/config.js'
import { ref, get, update, set, remove, runTransaction } from 'firebase/database'
import { Expense } from '../models/Expense.js'
const node = '/expenses/'

/**
 * @route   GET /api/expenses
 * @desc    Fetch all expense records from the database
 * @access  Public
*/
export const getExpenses = async (req, res) => {
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
        console.error("Error fetching expenses:", error);
        res.status(500).json({
            error: "Internal Server Error",
            message: "Could not retrieve expenses from the database."
        });
    }
}

/**
 * @route   GET /api/expenses/:id
 * @desc    Fetch a specific expense record by its ID
 */
export const getExpense = async (req, res) => {
    try {
        const snapshot = await get(ref(db, node + req.params.id));
        if (snapshot.exists()) {
            res.status(200).json(snapshot.val());
        } else {
            res.status(404).json({ error: "Not Found", message: "Expense not found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Server Error", message: error.message });
    }
}
/**
 * @route   PUT /api/expenses/:id
 * @desc    Update an expense record using Deep Merging logic.
 * Prioritizes new input, falls back to existing database values.
 */
export const putExpense = async (req, res) => {
    try {
        // Fetch data from database if available
        const ExpenseRef = ref(db, node + req.params.id)
        const snapshot = await get(ExpenseRef)
        if (!snapshot.exists()) {
            res.status(404).json({
                error: "Not Found",
                message: `Excepense with ID ${req.params.id} does not exist.`
            });
        } else {
            const existingData = snapshot.val();
            // Normalize keys
            // req.body = JSON.parse(JSON.stringify(req.body).toLowerCase());
            req.body = Expense.lowercaseKeys(req.body);
            /**
                     * Deep Merge Logic:
                     * Uses Nullish Coalescing (??) to check if the new input exists.
                     * If the input is null/undefined, it retains the existing database value.
                     */
            const mergedData = {
                'savings': Expense.removeEmpty({
                    "rrsp": req.body['savings']?.["rrsp"] ?? existingData['savings']?.["rrsp"],
                    "investment savings": req.body['savings']?.["investment savings"] ?? existingData['savings']?.["investment savings"],
                    "long-term savings": req.body['savings']?.["long-term savings"] ?? existingData['savings']?.["long-term savings"],
                    "bonds": req.body['savings']?.["bonds"] || existingData['savings']?.["bonds"],
                    "others": req.body['savings']?.["others"] ?? existingData['savings']?.["others"],
                }),

                'payment obligations': Expense.removeEmpty({
                    "credit card": req.body['payment obligations']?.["credit card"] ?? existingData['payment obligations']?.["credit card"],
                    "loan": req.body['payment obligations']?.["loan"] ?? existingData['payment obligations']?.["loan"],
                    "vehicle lease": req.body['payment obligations']?.["vehicle lease"] ?? existingData['payment obligations']?.["vehicle lease"],
                    "line of credit": req.body['payment obligations']?.["line of credit"] ?? existingData['payment obligations']?.["line of credit"],
                }),

                'insurance': Expense.removeEmpty({
                    "life insurance": req.body['insurance']?.["life insurance"] ?? existingData['insurance']?.["life insurance"],
                    "health insurance": req.body['insurance']?.["health insurance"] ?? existingData['insurance']?.["health insurance"],
                    "others": req.body['insurance']?.["others"] ?? existingData['insurance']?.["others"]
                }),

                'housing': Expense.removeEmpty({
                    "rent": req.body['housing']?.["rent"] ?? existingData['housing']?.["rent"],
                    "rent insurance": req.body['housing']?.["rent insurance"] ?? existingData['housing']?.["rent insurance"],
                    "storage and parking": req.body['housing']?.["storage and parking"] ?? existingData['housing']?.["storage and parking"],
                    "utilities": req.body['housing']?.["utilities"] ?? existingData['housing']?.["utilities"],
                    "maintainance": req.body['housing']?.["maintainance"] ?? existingData['housing']?.["maintainance"]
                }),

                'utilities': Expense.removeEmpty({
                    "phone": req.body['utilities']?.["phone"] ?? existingData['utilities']?.["phone"],
                    "internet": req.body['utilities']?.["internet"] ?? existingData['utilities']?.["internet"],
                    "water": req.body['utilities']?.["water"] ?? existingData['utilities']?.["water"],
                    "heat": req.body['utilities']?.["heat"] ?? existingData['utilities']?.["heat"],
                    "electricity": req.body['utilities']?.["electricity"] ?? existingData['utilities']?.["electricity"],
                    "cable": req.body['utilities']?.["cable"] ?? existingData['utilities']?.["cable"],
                    "others": req.body['utilities']?.["others"] ?? existingData['utilities']?.["others"]
                }),

                'personal': Expense.removeEmpty({
                    "transportation": req.body['personal']?.["transportation"] ?? existingData['personal']?.["transportation"],
                    "clothing": req.body['personal']?.["clothing"] ?? existingData['personal']?.["clothing"],
                    "gifts -family": req.body['personal']?.["gifts -family"] ?? existingData['personal']?.["gifts -family"],
                    "personal grooming": req.body['personal']?.["personal grooming"] ?? existingData['personal']?.["personal grooming"],
                    "dining out": req.body['personal']?.["dining out"] ?? existingData['personal']?.["dining out"],
                    "hobbies": req.body['personal']?.["hobbies"] ?? existingData['personal']?.["hobbies"],
                    "others": req.body['personal']?.["others"] ?? existingData['personal']?.["others"]
                })
            };

            // Final cleanup: removes top-level keys if they are undefined/empty
            Object.keys(mergedData).forEach(key => {
                if (mergedData[key] === undefined || mergedData[key] === null) {
                    delete mergedData[key];
                }
            });
            await update(ExpenseRef, { ...mergedData })
            res.status(200).send({ id: req.params.id, message: "Expense updated" });
        }
    } catch (error) {
        res.status(500).send(error.message);

    }
}
/**
 * @route   POST /api/expenses/:id
 * @desc    Create a new expense record with an auto-incrementing ID
 */
export const postExpense = async (req, res) => {
    try {
        // 1. Normalize keys
        req.body = Expense.lowercaseKeys(req.body);
        const newExpense = new Expense(req.body);
        // 2. Check if the object actually has data
        if (Object.keys(newExpense).length > 0) {
            const counterRef = ref(db, 'lastExpenseId');
            // 3. Atomically increment the ID
            const result = await runTransaction(counterRef, (currentValue) => {
                if (currentValue === null) {
                    return 100;
                }
                return currentValue + 1;
            });

            const newId = result.snapshot.val();
            // 4. Save the expense using the new ID
            await set(ref(db, node + newId), { ...newExpense })
            res.status(201).send({ id: newId, message: "Expense created" });
        } else {
            res.status(400).send("Invalid input: Expense object is empty.");
        }
    } catch (error) {
        res.status(500).send(`${error.message}`);
    }

}
/**
 * @route   DELETE /api/expenses/:id
 * @desc    Remove an expenses record from the database
 */
export const deleteExpense = async (req, res) => {
    try {
        const ExpenseId = req.params.id;

        if (!ExpenseId) {
            return res.status(400).send("Expense ID is required");
        }
        const ExpenseRef = ref(db, node + ExpenseId)
        const snapshot = await get(ExpenseRef)
        if (!snapshot.exists()) {
            res.status(404).json({
                error: "Not Found",
                message: `Expense with ID ${ExpenseId} does not exist.`
            });
        }
        await remove(ExpenseRef)
        res.status(204).send({ id: ExpenseId, message: "Expense Deleted" });
    } catch (error) {
        res.status(500).send(`${error.message}`);
    }
}