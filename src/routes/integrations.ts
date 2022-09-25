import express from 'express'
import {
  activateSheetsIntegration,
  deleteGoogleSheetsAccount,
  disableSheetsIntegration,
  getIntegrationsForForm,
} from '../controllers/integrations'

const integrationsRouter = express.Router()

integrationsRouter.delete(
  '/googleSheetsAccounts/:googleUserId',
  deleteGoogleSheetsAccount
)

integrationsRouter.get('/:formId', getIntegrationsForForm)

integrationsRouter.post(
  '/:formId/activateSheetsIntegration',
  activateSheetsIntegration
)

integrationsRouter.post(
  '/:formId/disableSheetsIntegration',
  disableSheetsIntegration
)

export default integrationsRouter
