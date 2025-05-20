import express from 'express'
import { streamWarning } from '../controllers/warningController.js'

const router = express.Router()

router.get('/warning-stream', streamWarning)

export default router
