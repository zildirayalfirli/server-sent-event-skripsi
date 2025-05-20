import express from 'express'
import { streamTemperature } from '../controllers/temperatureController.js'

const router = express.Router()

router.get('/temperature-stream', streamTemperature)

export default router
