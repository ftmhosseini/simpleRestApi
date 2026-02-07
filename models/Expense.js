/**
 * Represents a comprehensive Expense model.
 * Organizes financial outgoings into categorized groups (Housing, Savings, Personal, etc.)
 * and automatically prunes empty values to maintain data integrity.
 */
export class Expense {
    /**
     * @param {Object} data - The nested input object (usually from req.body)
     */
    constructor(data = {}) {
        // Helper to safely navigate nested data without crashing (using Optional Chaining)
        const getValue = (category, key) => data[category]?.[key];

        // Categorized Mapping: Each section is cleaned via removeEmpty()
        this['savings'] = Expense.removeEmpty({
            "rrsp": getValue("savings", "rrsp"),
            "investment savings": getValue("savings", "investment savings"),
            "long-term savings": getValue("savings", "long-term savings"),
            "bonds": getValue("savings", "bonds"),
            "others": getValue("savings", "others"),
        });
        this['payment obligations'] = Expense.removeEmpty({
            "credit card": getValue("payment obligations", "credit card"),
            "loan": getValue("payment obligations", "loan"),
            "vehicle lease": getValue("payment obligations", "vehicle lease"),
            "line of credit": getValue("payment obligations", "line of credit"),
        });
        this['insurance'] = Expense.removeEmpty({
            "life insurance": getValue("insurance", "life insurance"),
            "health insurance": getValue("insurance", "health insurance"),
            "others": getValue("insurance", "others")
        });
        this['housing'] = Expense.removeEmpty({
            "rent": getValue("housing", "rent"),
            "rent insurance": getValue("housing", "rent insurance"),
            "sorage and parking": getValue("housing", "sorage and parking"),
            "utilities": getValue("housing", "utilities"),
            "maintainance": getValue("housing", "maintainance")
        });
        this['utilities'] = Expense.removeEmpty({
            "phone": getValue("utilities", "phone"),
            "internet": getValue("utilities", "internet"),
            "water": getValue("utilities", "water"),
            "heat": getValue("utilities", "heat"),
            "electricity": getValue("utilities", "electricity"),
            "cable": getValue("utilities", "cable"),
            "others": getValue("utilities", "others")
        });
        this['personal'] = Expense.removeEmpty({
            "transportation": getValue("personal", "transportation"),
            "clothing": getValue("personal", "clothing"),
            "gifts -family": getValue("personal", "gifts -family"),
            "personal grooming": getValue("personal", "personal grooming"),
            "dining out": getValue("personal", "dining out"),
            "hobbies": getValue("personal", "hobbies"),
            "others": getValue("personal", "others")
        });

        // Final cleanup: Remove top-level categories if they ended up empty/undefined
        Object.keys(this).forEach((item) => {
            if (this[item] === undefined || this[item] === null) {
                delete this[item];
            }
        })
    }

    /**
     * Filters out null, undefined, or empty strings from an object.
     * @param {Object} obj - The category object to clean
     * @returns {Object|undefined} - Returns the cleaned object, or undefined if empty
     */
    static removeEmpty(obj) {
        const cleanObj = {};
        Object.keys(obj).forEach((key) => {
            // Only add the key if it has a real value (not undefined, null, or empty string)
            if (obj[key] !== undefined && obj[key] !== null && obj[key] !== "") {
                cleanObj[key] = obj[key];
            }
        });
        return Object.keys(cleanObj).length > 0 ? cleanObj : undefined;
    }

    /**
     * Recursively converts all object keys to lowercase.
     * Useful for standardizing input regardless of how the user typed the keys.
     * @param {Object|Array} obj - The data structure to transform
     */
    static lowercaseKeys = (obj) => {
        if (typeof obj !== 'object' || obj === null) return obj;

        if (Array.isArray(obj)) {
            return obj.map(lowercaseKeys);
        }

        return Object.keys(obj).reduce((acc, key) => {
            // Lowercase the current key and recurse for nested objects
            acc[key.toLowerCase()] = Expense.lowercaseKeys(obj[key]);
            return acc;
        }, {});
    };
}