import { db } from '../config/config.js'
import { ref, get, update, set, remove, runTransaction } from 'firebase/database'
import { Expense } from '../models/Expense.js'
const node = '/expenses/'
export const getExpenses = async (req, res) => {
    const snapshot = await get(ref(db, node))
    if (snapshot.exists())
        res.status(200).send(snapshot)
    else
        res.status(404).send('Not found a Expense with this id')

    res.send('welcome to this page')


}
export const getExpense = async (req, res) => {
    const snapshot = await get(ref(db, node + req.params.id))
    if (snapshot.exists())
        res.status(200).send(snapshot)
    else
        res.status(404).send('Not found a Expense with this id')
}
export const putExpense = async (req, res) => {
    try {
        const ExpenseRef = ref(db, node + req.params.id)
        const snapshot = await get(ExpenseRef)
        if (!snapshot.exists()) {
            res.status(404).json({
                error: "Not Found",
                message: `Excepence with ID ${req.params.id} does not exist.`
            });
        }
        const existingData = snapshot.val();
        // req.body = JSON.parse(JSON.stringify(req.body).toLowerCase());
        req.body = Expense.lowercaseKeys(req.body);
        const mergedData = {
            'saving': Expense.removeEmpty({
                "rrsp": req.body['saving']?.["rrsp"] ?? existingData['saving']?.["rrsp"],
                "investment savings": req.body['saving']?.["investment savings"] ?? existingData['saving']?.["investment savings"],
                "long-term savings": req.body['saving']?.["long-term savings"] ?? existingData['saving']?.["long-term savings"],
                "bonds": req.body['saving']?.["bonds"] ?? existingData['saving']?.["bonds"],
                "others": req.body['saving']?.["others"] ?? existingData['saving']?.["others"],
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

    } catch (error) {
        res.status(500).send(error.message);

    }
}
export const postExpense = async (req, res) => {
    try {
        const counterRef = ref(db, 'lastExpenseId');
        const result = await runTransaction(counterRef, (currentValue) => {
            if (currentValue === null) {
                return 100;
            }
            return currentValue + 1;
        });

        const newId = result.snapshot.val();
        req.body = Expense.lowercaseKeys(req.body);

        
        const newExpense = new Expense(req.body);

        await set(ref(db, node + newId), { ...newExpense })
        res.status(201).send({ id: newId, message: "Expense created" });
    } catch (error) {
        res.status(500).send(`${error.message}`);
    }

}
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