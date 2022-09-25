import { Request, Response } from 'express'
import { db } from '../services/firebase'
import { validateUserAccessToForm } from '../services/forms'

const getForm = async (req: Request, res: Response) => {
  try {
    const formId = req.params.formId
    await validateUserAccessToForm(formId, req.userId)
    const form = await db.collection('Forms').doc(formId).get()
    res.status(200).json(form.data())
  } catch (error) {
    res.status(500).send('Internal server error')
  }
}

const getForms = async (req: Request, res: Response) => {
  try {
    const result = await db
      .collection('Forms')
      .where('userId', '==', req.userId)
      .get()

    const forms: any = {}
    result.forEach((form) => {
      forms[form.id] = form.data()
    })

    res.status(200).json(forms)
  } catch (error) {
    res.status(500).send('Internal server error')
  }
}

const createForm = async (req: Request, res: Response) => {
  try {
    const { form } = req.body
    const userId = req.userId

    const formWithUserId = { ...form, userId }

    const newFormDocument = await db.collection('Forms').add(formWithUserId)
    const formId = newFormDocument.id
    // initialize integrations
    await db
      .collection('Integrations')
      .doc(formId)
      .set({
        email: {
          enabled: false,
          fieldIdForEmail: '',
          fieldIdForName: '',
          mailerliteGroupId: '',
        },
        googleSheets: {
          enabled: false,
          sheetId: '',
          sheetName: '',
          tokenId: '',
        },
        maxCapacity: -1,
        userId,
      })

    const formResult = await newFormDocument.get()

    res.status(200).json({ formId, form: formResult.data() })
  } catch (error) {
    res.status(500).send('Internal server error')
  }
}

const updateForm = async (req: Request, res: Response) => {
  try {
    const formId = req.params.formId
    const { form } = req.body

    await validateUserAccessToForm(formId, req.userId)

    await db.collection('Forms').doc(formId).update(form)
    res.status(200).send('Form updated')
  } catch (error) {
    res.status(500).send('Internal server error')
  }
}

const deleteForm = async (req: Request, res: Response) => {
  try {
    const formId = req.params.formId

    await validateUserAccessToForm(formId, req.userId)

    await Promise.all([
      db.collection('Forms').doc(formId).delete(),
      db.collection('Integrations').doc(formId).delete(),
    ])
    const answers = await db
      .collection('AllAnswers')
      .doc(formId)
      .collection('Answers')
      .get()

    answers.forEach((doc) => doc.ref.delete())

    res.status(200).send('Form deleted')
  } catch (error) {
    res.status(500).send('Internal server error')
  }
}

export { getForm, getForms, updateForm, deleteForm, createForm }
