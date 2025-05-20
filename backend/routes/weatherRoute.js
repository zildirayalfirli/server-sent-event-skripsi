import express from 'express'
import { streamWeather } from '../controllers/weatherController.js'

const router = express.Router()

router.get('/weather-stream', streamWeather)

export default router
