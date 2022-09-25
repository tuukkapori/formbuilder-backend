import { ServiceAccount } from 'firebase-admin'
import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { getAuth } from 'firebase-admin/auth'
import dotenv from 'dotenv'
import { Request, Response, NextFunction } from 'express'

dotenv.config()

// cloud run is weird with env variables
const private_key = process.env.DEVELOPMENT_MODE
  ? process.env.ADMIN_PRIVATE_KEY
  : JSON.parse(process.env.ADMIN_PRIVATE_KEY || '')

const serviceAccount = {
  type: process.env.ADMIN_TYPE,
  private_key,
  project_id: process.env.ADMIN_PROJECT_ID as string,
  private_key_id: process.env.ADMIN_PRIVATE_KEY_ID,
  client_email: process.env.ADMIN_CLIENT_EMAIL,
  client_id: process.env.ADMIN_CLIENT_ID,
  auth_uri: process.env.ADMIN_AUTH_URI,
  token_uri: process.env.ADMIN_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.ADMIN_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.ADMIN_CLIENT_X509_CERT_URL,
} as ServiceAccount

const app = initializeApp({
  credential: cert(serviceAccount),
})

const db = getFirestore()

const authenticateFirebaseUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.split(' ')[0] === 'Bearer'
    ) {
      const authToken = req.headers.authorization.split(' ')[1]
      const decodedToken = await getAuth().verifyIdToken(authToken)
      req.userId = decodedToken.uid

      return next()
    } else {
      throw new Error('Invalid auth token')
    }
  } catch (error) {
    return res.status(401).send({ error: 'Not authorized' })
  }
}

export { app, db, authenticateFirebaseUser }
