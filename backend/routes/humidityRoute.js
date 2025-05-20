import express from 'express'
import { streamHumidity } from '../controllers/humidityController.js'

const router = express.Router()

router.get('/humidity-stream', streamHumidity)

export default router
