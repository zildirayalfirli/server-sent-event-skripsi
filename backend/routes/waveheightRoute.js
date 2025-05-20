import express from 'express'
import { streamWaveHeight } from '../controllers/waveheightController.js'

const router = express.Router()

router.get('/waveheight-stream', streamWaveHeight)

export default router
