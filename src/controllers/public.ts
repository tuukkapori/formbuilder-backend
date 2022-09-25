import axios from 'axios'
import { db } from '../services/firebase'
import { Request, Response } from 'express'
import { validateIsFormOpen } from '../services/forms'

const getFormPublic = async (req: Request, res: Response) => {
  const formId = req.params.formId
  const result = await db.collection('Forms').doc(formId).get()

  const form = result.data()

  if (form && form.status === 'open') {
    delete form.userId

    res.status(200).json({ form })
  } else {
    res.status(404).end()
  }
}

const submitForm = async (req: Request, res: Response) => {
  try {
    const formId = req.params.formId

    await validateIsFormOpen(formId)

    const { answers } = req.body
    const submittedAt = Date.now()
    const submission = { formId, submittedAt, answers }
    console.log('saving submission')
    await db
      .collection('AllAnswers')
      .doc(formId)
      .collection('Answers')
      .add(submission)
    console.log('submission succes')
    const formDoc = await db.collection('Forms').doc(formId).get()
    const formOwner = formDoc.data()?.userId

    try {
      await axios.post(
        process.env.PUBSUB_SERVER_BASE_URL + '/submission/' + formId,
        {
          apiToken: process.env.SUBMISSION_API_TOKEN,
          answers: submission,
          userId: formOwner,
        }
      )
    } catch (error) {
      console.log('Error sending submission to pubsub server!')
    }

    res.status(200).send('Form submitted!')
  } catch (error) {
    res.status(500).send('Error submitting form')
  }
}

export { getFormPublic, submitForm }
