export class Income {
    constructor(data={}) {
        this.wages = data['wages'];
        this.secondaryIncome = data['secondary income'];
        this.interest = data['interest'];
        this.supportPayment = data['support payment'];
        this.others = data['others'];
    
        Object.keys(this).forEach((item) => {
            if (this[item] === undefined || this[item] === null){
                delete this[item];
            }
        })
    }

    // Static method to validate data before creating a class instance
    static validate(data) {
        if (!data.wages) {
            throw new Error("wages is required fields.");
        }
        return true;
    }
}