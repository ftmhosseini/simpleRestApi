/**
 * Represents a User entity within the application.
 * This class handles data structure, default values, and basic validation.
 */
export class User {
    /**
     * @param {string} name - Full name of the user
     * @param {string} username - Unique handle for the user
     * @param {string} email - User email address
     * @param {Object} address - Nested object containing street, suite, city, and zipcode
     */
    constructor(name, username, email, address) {
        this.name = name;
        this.username = username;
        this.email = email;
        this.address = {
            street: address?.street || null,
            suite: address?.suite || null,
            city: address?.city || null,
            zipcode: address?.zipcode || null
        }
        // Data Cleanup: Remove any keys that are null or undefined to keep the object "lean"
        Object.keys(this).forEach((item) => {
            if (this[item] === undefined || this[item] === null) {
                delete this[item];
            }
        })
    }

    /**
         * Static Validation Method
         * Checks if the raw input data meets the minimum requirements before instantiation.
         * @param {Object} data - The raw request body (req.body)
         * @throws {Error} - If required fields are missing or malformed
         * @returns {boolean} - Returns true if valid
         */
    static validate(data) {
        if (!data || typeof data !== 'object') {
            throw new Error("Invalid input: Data must be an object");
        }
        if (!data.name || !data.username) {
            throw new Error("Name and Username are required");
        }
        // Basic email format check
        if (typeof data.email !== 'string' || !data.email.includes("@")) {
            throw new Error("A valid email string is required");
        }
        return true;
    }
}