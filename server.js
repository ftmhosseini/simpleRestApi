import express from 'express'
import userRouter from './routes/userRoute.js'
import ExpenseRouter from './routes/ExpenseRoute.js'
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
app.get('/',(req,res)=>{
    res.send('hello from sarvin back')
})

app.listen(3400)