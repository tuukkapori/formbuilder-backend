import express from 'express'
import { googleAuth, googleAuthCallback } from '../controllers/authentication'

const authenticationRouter = express.Router()

authenticationRouter.get('/googleAuth', googleAuth)

authenticationRouter.get('/googleAuthCallback', googleAuthCallback)

export default authenticationRouter
