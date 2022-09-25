import { Request, Response } from 'express'
import { db } from '../services/firebase'
import { validateUserAccessToForm } from '../services/forms'
import { Answer } from '../types/forms'

const getAnswersForForm = async (req: Request, res: Response) => {
  try {
    const formId = req.params.formId

    await validateUserAccessToForm(formId, req.userId)

    const result = await db
      .collection('AllAnswers')
      .doc(formId)
      .collection('Answers')
      .get()

    if (!result.empty) {
      const answersArray = [] as Answer[]
      result.forEach((ans) => {
        answersArray.push(ans.data() as Answer)
      })
      const unNested = answersArray.map((ans) => {
        const answers = {
          submittedAt: ans.submittedAt,
        } as Answer

        Object.keys(ans.answers).map((key) => {
          answers[key] = (ans.answers as any)[key]
        })
        return answers
      })
      const sorted = unNested.sort((a, b) => a.submittedAt - b.submittedAt)
      res.status(200).json(sorted)
    } else {
      res.status(200).json([])
    }
  } catch (error) {
    res.status(500).send('Internal server error')
  }
}

export { getAnswersForForm }
