import { db } from './firebase'

const validateUserAccessToForm = async (formId: string, userId: string) => {
  const res = await db.collection('Forms').doc(formId).get()
  const form = res.data()
  if (form && form.userId === userId) {
    return true
  } else {
    throw new Error('User does not have access to this form!')
  }
}

const validateIsFormOpen = async (formId: string) => {
  const formDocument = await db.collection('Forms').doc(formId).get()
  const form = formDocument.data()
  if (form && form.status === 'open') {
    return true
  } else {
    throw new Error('Form is closed')
  }
}

export { validateUserAccessToForm, validateIsFormOpen }
