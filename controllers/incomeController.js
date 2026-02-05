import { db } from '../config/config.js'
import { ref, get, update, set, remove, runTransaction } from 'firebase/database'
import { Income } from '../models/Income.js'
import { Expense } from '../models/Expense.js'
const node = '/income/'
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
        console.error("Error fetching expenses:", error);
        res.status(500).json({ 
            error: "Internal Server Error", 
            message: "Could not retrieve expenses from the database." 
        });
    }
}
export const getIncome = async (req, res) => {
    try {
        const snapshot = await get(ref(db, node + req.params.id));
        if (snapshot.exists()) {
            res.status(200).json(snapshot.val()); // Use .json() for consistency
        } else {
            res.status(404).json({ error: "Not Found", message: "Expense not found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Server Error", message: error.message });
    }
}
export const putIncome = async (req, res) => {
    try {
        const incomeRef = ref(db, node + req.params.id)
        const snapshot = await get(incomeRef)
        if (!snapshot.exists()) {
            res.status(404).json({
                error: "Not Found",
                message: `Income with ID ${req.params.id} does not exist.`
            });
        }
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

    } catch (error) {
        res.status(500).send(error.message);

    }
}
export const postIncome = async (req, res) => {
    try {
        const counterRef = ref(db, 'lastIncomeId');
        const result = await runTransaction(counterRef, (currentValue) => {
            if (currentValue === null) {
                return 100;
            }
            return currentValue + 1;
        });

        const newId = result.snapshot.val();
        req.body = Expense.lowercaseKeys(req.body);

        const newIncome = new Income(req.body);
        Income.validate(req.body)
        await set(ref(db, node + newId), { ...newIncome })
        res.status(201).send({ id: newId, message: "Income created" });
    } catch (error) {
        res.status(500).send(`${error.message}`);
    }

}
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