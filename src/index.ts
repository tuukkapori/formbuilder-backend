import express, { Express, Request, Response } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import publicRouter from './routes/public'
import mainRouter from './routes'

dotenv.config()



const app = express()
app.use(cors())
app.use(express.json())

app.use('/api', mainRouter)
app.use('/public', publicRouter)

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 8080
app.listen(PORT, () => {
  console.log('server listening on port: ', PORT)
})
