import { Request, Response } from 'express'
import { db } from '../services/firebase'
import {
  appendDataToSheet,
  createNewGoogleSheet,
  getGoogleAuthClient,
} from '../services/google'

const getIntegrationsForForm = async (req: Request, res: Response) => {
  try {
    const formId = req.params.formId
    const result = await db.collection('Integrations').doc(formId).get()

    const integrations = result.data()

    res.status(200).json(integrations)
  } catch (error) {
    res.status(500).send('Internal server error')
  }
}

const activateSheetsIntegration = async (req: Request, res: Response) => {
  try {
    const formId = req.params.formId

    const { spreadSheetName, googleUserId } = req.body

    const form = (await db.collection('Forms').doc(formId).get()).data() as any
    const integration = (
      await db.collection('Integrations').doc(formId).get()
    ).data() as any

    if (form && integration) {
      const token = (
        await db.collection('GoogleTokens').doc(googleUserId).get()
      ).data() as any

      const authClient = await getGoogleAuthClient()
      authClient.setCredentials({
        refresh_token: token.refreshToken,
      })

      const newSpreadsheetId = (await createNewGoogleSheet(
        spreadSheetName,
        authClient
      )) as any

      const columnTitles = [
        'Submitted at',
        ...form.fields.map((field: any) => field.title),
      ]

      await appendDataToSheet(authClient, newSpreadsheetId, 'A:A', columnTitles)

      await db
        .collection('Integrations')
        .doc(formId)
        .update({
          ['googleSheets.enabled']: true,
          ['googleSheets.sheetId']: newSpreadsheetId,
          ['googleSheets.sheetName']: spreadSheetName,
          ['googleSheets.googleUserId']: googleUserId,
        })

      res.status(200).json({
        newSpreadsheetId,
        message: 'Google sheets integration activated!',
      })
    } else {
      throw new Error('Something went wrong')
    }
  } catch (error) {
    res.status(500).send('Internal server error')
  }
}

const disableSheetsIntegration = async (req: Request, res: Response) => {
  try {
    const formId = req.params.formId
    await db
      .collection('Integrations')
      .doc(formId)
      .update({
        ['googleSheets.enabled']: false,
        ['googleSheets.sheetId']: '',
        ['googleSheets.sheetName']: '',
        ['googleSheets.googleUserId']: '',
      })
    res.status(200).send('Sheets integration disabled')
  } catch (error) {
    res.status(500).send('Internal server error')
  }
}

const deleteGoogleSheetsAccount = async (req: Request, res: Response) => {
  try {
    const googleUserId = req.params.googleUserId
    await db.collection('GoogleTokens').doc(googleUserId).delete()
    res.status(200).send('Google sheets account deleted')
  } catch (error) {
    res.status(500).send('Internal server error')
  }
}

export {
  getIntegrationsForForm,
  activateSheetsIntegration,
  disableSheetsIntegration,
  deleteGoogleSheetsAccount,
}
