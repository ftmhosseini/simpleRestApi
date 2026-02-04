export class User {
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
        Object.keys(this).forEach((item) => {
            if (this[item] === undefined || this[item] === null){
                delete this[item];
            }
        })
    }

    // Static method to validate data before creating a class instance
    static validate(data) {
        if (!data || typeof data !== 'object') {
            throw new Error("Invalid input: Data must be an object");
        }
        if (!data.name || !data.username) {
            throw new Error("Name and Username are required");
        }
        if (typeof data.email !== 'string' || !data.email.includes("@")) {
            throw new Error("A valid email string is required");
        }
        return true;
    }
}