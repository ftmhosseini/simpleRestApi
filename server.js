import express from 'express'
import userRouter from './routes/userRoute.js'
import ExpenseRouter from './routes/expenseRoute.js'
import incomeRouter from './routes/incomeRoute.js'

const app = express()
app.use(express.json())
app.use(express.urlencoded())
app.get('/favicon.ico', (req,res)=>{
    res.status(200);
})
app.use('/api/users', userRouter)
app.use('/api/Expenses', ExpenseRouter)
app.use('/api/income', incomeRouter)
app.get('/', (req, res) => {
    res.status(200).json({
        message: "Welcome to the Simple REST API 🚀",
        description: "A robust backend designed to manage personal finances, including users, income, and expenses.",
        version: "1.0.0",
        endpoints: {
            users: {
                listAll: "GET /api/users",
                getOne: "GET /api/users/:id",
                create: "POST /api/users",
                update: "PATCH /api/users/:id",
                delete: "DELETE /api/users/:id"
            },
            income: "GET, POST, DELETE, PUT on /api/income",
            expenses: "GET, POST, DELETE, PUT on /api/expenses"
        },
        author: "Fatemeh",
        repository: "https://github.com/ftmhosseini/simpleRestApi"
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));