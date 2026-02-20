import express from 'express'
import userRouter from './routes/userRoute.js'
import expenseRouter from './routes/expenseRoute.js'
import incomeRouter from './routes/incomeRoute.js'

const app = express()

// --- Middleware ---
// Parse incoming JSON payloads
app.use(express.json())
// Parse URL-encoded data (extended: true is the standard default for rich objects)
app.use(express.urlencoded())

// --- System Routes ---
// Health check for browsers to prevent 404 logs in the console
app.get('/favicon.ico', (req,res)=>{
    res.status(200);
})

// --- API Resource Routes ---
app.use('/api/users', userRouter)
app.use('/api/expenses', expenseRouter)
app.use('/api/income', incomeRouter)
/**
 * @route   GET /
 * @desc    API Root: Returns metadata, available endpoints, and project info
 * @access  Public
 */
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
        author: "Fatemeh Hosseini",
        repository: "https://github.com/ftmhosseini/simpleRestApi",
        deployed: "https://simplerestapi-gjve.onrender.com/"
    });
});

// --- Server Initialization ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));