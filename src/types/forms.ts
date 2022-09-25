export interface FormAnswers {
  [key: string]: string | number
}

export interface AnswerFromDB {
  submittedAt: number
  answers: FormAnswers
  formId: string
}

export interface Answer {
  submittedAt: number
  formId: string
  [key: string]: string | number
}
