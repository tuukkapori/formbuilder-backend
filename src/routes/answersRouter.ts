import express from 'express'
import { getAnswersForForm } from '../controllers/answers'

const answersRouter = express.Router()

answersRouter.get('/:formId', getAnswersForForm)

export default answersRouter
