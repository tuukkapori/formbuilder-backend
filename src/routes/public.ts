import express from 'express'
import { googleAuth, googleAuthCallback } from '../controllers/authentication'
import { getFormPublic, submitForm } from '../controllers/public'
const publicRouter = express.Router()

publicRouter.get('/forms/:formId', getFormPublic)

publicRouter.post('/submit/:formId', submitForm)

publicRouter.get('/googleAuth', googleAuth)

publicRouter.get('/googleAuthCallback', googleAuthCallback)

export default publicRouter
