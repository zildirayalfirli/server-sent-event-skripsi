import express from 'express'
import { streamWind } from '../controllers/windController.js'

const router = express.Router()

router.get('/wind-stream', streamWind)

export default router
