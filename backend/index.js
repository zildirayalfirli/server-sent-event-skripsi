import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { connectDB } from './db/mongodb.js'
import streamRoute from './routes/streamRoute.js'
import { broadcast } from './controllers/streamController.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 9000

app.use(cors())
app.use(express.json())

app.use('/', streamRoute)

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running`)
  })
  broadcast()
})