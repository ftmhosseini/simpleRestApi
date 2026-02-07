/**
 * Represents the Income structure for the finance tracker.
 * Maps raw input data to specific income categories and sanitizes the object.
 */
export class Income {
    /**
     * @param {Object} data - Input object containing income sources
     */
    constructor(data = {}) {
        // Map specific keys from the input data to class properties
        this.wages = data['wages'];
        this.secondaryIncome = data['secondary income'];
        this.interest = data['interest'];
        this.supportPayment = data['support payment'];
        this.others = data['others'];

        // Data Sanitization: Removes any properties that weren't provided (null/undefined)
        // This ensures the final object only contains active income sources.
        Object.keys(this).forEach((item) => {
            if (this[item] === undefined || this[item] === null) {
                delete this[item];
            }
        })
    }

/**
     * Static Validation Method
     * Enforces business logic: An income entry is invalid without a primary 'wages' value.
     * @param {Object} data - The raw data to check
     * @throws {Error} - If primary income (wages) is missing
     * @returns {boolean} - Returns true if validation passes
     */    
    static validate(data) {
        if (!data.wages) {
            throw new Error("wages is required fields.");
        }
        return true;
    }
}