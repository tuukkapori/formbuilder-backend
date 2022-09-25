import { OAuth2Client } from 'google-auth-library'
import { google } from 'googleapis'

const getGoogleAuthClient = async () => {
  const oAuth2Client = new google.auth.OAuth2(
    process.env.OAUTH_CLIENT_ID,
    process.env.OAUTH_CLIENT_SECRET,
    process.env.OAUTH_REDIRECT_URI
  )

  return oAuth2Client
}

const appendDataToSheet = async (
  authClient: any,
  spreadsheetId: string,
  range: string,
  values: any[]
) => {
  const sheets = google.sheets({ version: 'v4', auth: authClient })

  const request = {
    spreadsheetId,
    range,
    valueInputOption: 'RAW',
    insertDataOption: 'INSERT_ROWS',
    resource: {
      majorDimension: 'ROWS',
      values: [values],
    },
    auth: authClient,
  }

  const response = (await sheets.spreadsheets.values.append(request)).data
  return response
}

const getUserData = async (oauthClient: any) => {
  const googleAuth = google.oauth2({
    version: 'v2',
    auth: oauthClient,
  })

  const googleUserInfo = await googleAuth.userinfo.get()
  return googleUserInfo.data
}

const createNewGoogleSheet = async (
  spreadSheetName: string,
  oauthClient: OAuth2Client
) => {
  const sheets = google.sheets({ version: 'v4', auth: oauthClient })

  const newSheet = await sheets.spreadsheets.create({
    fields: 'spreadsheetId',
    requestBody: {
      properties: {
        title: spreadSheetName,
      },
    },
  })

  return newSheet.data.spreadsheetId
}

export {
  getUserData,
  appendDataToSheet,
  getGoogleAuthClient,
  createNewGoogleSheet,
}
