import { Request, Response } from 'express'
import { getGoogleAuthClient, getUserData } from '../services/google'
import axios from 'axios'
import { db } from '../services/firebase'

const googleAuth = async (req: Request, res: Response) => {
  try {
    const oauthClient = await getGoogleAuthClient()
    const scopes = [
      'https://www.googleapis.com/auth/spreadsheets',
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ]
    const userId = req.query.userId
    const authToken = req.query.authToken

    const redirectURL =
      process.env.CLOUDRUN_API_BASE_URL + '/public/googleAuthCallback'

    const authorizationUrl = oauthClient.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      include_granted_scopes: true,
      redirect_uri: redirectURL,
      state: `${userId},${authToken}`,
    })

    res.redirect(authorizationUrl)
  } catch (error) {
    res.status(500).send('Internal server error')
  }
}

const googleAuthCallback = async (req: Request, res: Response) => {
  try {
    const error = req.query.error
    const [userId, authToken] = (req.query?.state as string).split(',')

    if (error) {
      res.status(500).send('Access denied most likely')
    }

    const code = req.query.code
    if (code && typeof code === 'string') {
      const oauthClient = await getGoogleAuthClient()
      const { tokens } = await oauthClient.getToken(code)

      oauthClient.setCredentials(tokens)
      const data = await getUserData(oauthClient)

      if (data.id && tokens.refresh_token) {
        await db
          .collection('GoogleTokens')
          .doc(data.id)
          .set({ refreshToken: tokens.refresh_token, userId })
      } else {
        console.log('No refresh token found')
      }

      // send user details to pub sub server
      await axios.post(
        process.env.PUBSUB_SERVER_BASE_URL + '/googleAuth/' + userId,
        {
          data,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      )

      res.status(200).send('Success!')
    } else {
      res.status(500).json({
        message: 'Code invalid',
      })
    }
  } catch (error: any) {
    console.log('Error in google auth callback ', error.message)
    res.status(500).send('Internal server error')
  }
}

export { googleAuth, googleAuthCallback }
