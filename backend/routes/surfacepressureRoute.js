import express from 'express'
import { streamSurfacePressure } from '../controllers/surfacepressureController.js'

const router = express.Router()

router.get('/surfacepressure-stream', streamSurfacePressure)

export default router
