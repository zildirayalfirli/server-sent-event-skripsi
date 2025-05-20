import express from 'express'
import { streamTideHeight } from '../controllers/tideheightController.js'

const router = express.Router()

router.get('/tideheight-stream', streamTideHeight)

export default router
