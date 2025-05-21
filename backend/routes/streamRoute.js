import express from 'express'
import { Stream } from '../controllers/streamController.js'

const router = express.Router()

router.get('/', Stream)

export default router
