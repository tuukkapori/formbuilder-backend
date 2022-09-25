import express from 'express'
import {
  deleteForm,
  getForm,
  getForms,
  updateForm,
  createForm,
} from '../controllers/forms'
const formsRouter = express.Router()

formsRouter.get('/', getForms)

formsRouter.post('/', createForm)

formsRouter.get('/:formId', getForm)

formsRouter.put('/:formId', updateForm)

formsRouter.delete('/:formId', deleteForm)

export default formsRouter
