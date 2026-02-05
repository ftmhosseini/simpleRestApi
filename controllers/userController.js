import { db } from '../config/config.js'
import { ref, get, update, set, remove, runTransaction } from 'firebase/database'
import { User } from '../models/User.js'
import { Expense } from '../models/Expense.js'
const node = '/users/'
export const getUsers = async (req, res) => {
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
export const getUser = async (req, res) => {
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
export const putUser = async (req, res) => {
    try {
        const userRef = ref(db, node + req.params.id)
        const snapshot = await get(userRef)
        if (!snapshot.exists()) {
            res.status(404).json({
                error: "Not Found",
                message: `User with ID ${req.params.id} does not exist.`
            });
        }
        const existingData = Object.values(snapshot.val());
        req.body = Expense.lowercaseKeys(req.body);

        const mergedData = {
            name: req.body.name || existingData['name'],
            username: req.body.username || existingData['username'],
            email: req.body.email || existingData['email'],
            address: {
                // ...(req.body.address) || (existingData['address'])
                street: req.body.address?.street || existingData.address?.street,
                suite: req.body.address?.suite || existingData.address?.suite,
                city: req.body.address?.city || existingData.address?.city,
                zipcode: req.body.address?.zipcode || existingData.address?.zipcode
            }
        }
        Object.keys(mergedData).forEach((item) => {
            if (mergedData[item] === undefined)
                delete mergedData[item]
        })
        await update(userRef, { ...mergedData })
        res.status(200).send({ id: req.params.id, message: "User updated" });

    } catch (error) {
        res.status(500).send(error.message);

    }
}
export const postUser = async (req, res) => {
    try {
        const counterRef = ref(db, 'lastUserId');
        const result = await runTransaction(counterRef, (currentValue) => {
            if (currentValue === null) {
                return 100; // Start at 100 if it's the first ever user
            }
            return currentValue + 1;
        });

        const newId = result.snapshot.val();
        req.body = Expense.lowercaseKeys(req.body);

        const newUser = new User(req.body.name, req.body.username, req.body.email, req.body.address);
        User.validate(req.body)
        await set(ref(db, node + newId), { ...newUser })
        res.status(201).send({ id: newId, message: "User created" });
    } catch (error) {
        res.status(500).send(`${error.message}`);
    }

}
export const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;

        if (!userId) {
            return res.status(400).send("User ID is required");
        }
        const userRef = ref(db, node + userId)
        const snapshot = await get(userRef)
        if (!snapshot.exists()) {
            res.status(404).json({
                error: "Not Found",
                message: `User with ID ${userId} does not exist.`
            });
        }
        await remove(userRef)
        res.status(204).send({ id: userId, message: "User Deleted" });
    } catch (error) {
        res.status(500).send(`${error.message}`);
    }
}