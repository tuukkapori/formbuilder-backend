"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNewGoogleSheet = exports.getGoogleAuthClient = exports.appendDataToSheet = exports.getUserData = void 0;
const googleapis_1 = require("googleapis");
const getGoogleAuthClient = () => __awaiter(void 0, void 0, void 0, function* () {
    const oAuth2Client = new googleapis_1.google.auth.OAuth2(process.env.OAUTH_CLIENT_ID, process.env.OAUTH_CLIENT_SECRET, process.env.OAUTH_REDIRECT_URI);
    return oAuth2Client;
});
exports.getGoogleAuthClient = getGoogleAuthClient;
const appendDataToSheet = (authClient, spreadsheetId, range, values) => __awaiter(void 0, void 0, void 0, function* () {
    const sheets = googleapis_1.google.sheets({ version: 'v4', auth: authClient });
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
    };
    const response = (yield sheets.spreadsheets.values.append(request)).data;
    return response;
});
exports.appendDataToSheet = appendDataToSheet;
const getUserData = (oauthClient) => __awaiter(void 0, void 0, void 0, function* () {
    const googleAuth = googleapis_1.google.oauth2({
        version: 'v2',
        auth: oauthClient,
    });
    const googleUserInfo = yield googleAuth.userinfo.get();
    return googleUserInfo.data;
});
exports.getUserData = getUserData;
const createNewGoogleSheet = (spreadSheetName, oauthClient) => __awaiter(void 0, void 0, void 0, function* () {
    const sheets = googleapis_1.google.sheets({ version: 'v4', auth: oauthClient });
    const newSheet = yield sheets.spreadsheets.create({
        fields: 'spreadsheetId',
        requestBody: {
            properties: {
                title: spreadSheetName,
            },
        },
    });
    return newSheet.data.spreadsheetId;
});
exports.createNewGoogleSheet = createNewGoogleSheet;
