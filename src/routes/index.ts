import express from 'express'
import { authenticateFirebaseUser } from '../services/firebase'
import answersRouter from './answersRouter'
import authenticationRouter from './authentication'
import formsRouter from './formsRouter'
import integrationsRouter from './integrations'
const mainRouter = express.Router()

mainRouter.use(authenticateFirebaseUser)

mainRouter.use('/forms', formsRouter)

mainRouter.use('/integrations', integrationsRouter)

mainRouter.use('/answers', answersRouter)

mainRouter.use('/authentication', authenticationRouter)

export default mainRouter
