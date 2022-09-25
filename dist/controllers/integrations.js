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
exports.deleteGoogleSheetsAccount = exports.disableSheetsIntegration = exports.activateSheetsIntegration = exports.getIntegrationsForForm = void 0;
const firebase_1 = require("../services/firebase");
const google_1 = require("../services/google");
const getIntegrationsForForm = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const formId = req.params.formId;
        const result = yield firebase_1.db.collection('Automations').doc(formId).get();
        const integrations = result.data();
        res.status(200).json(integrations);
    }
    catch (error) {
        res.status(500).send('Internal server error');
    }
});
exports.getIntegrationsForForm = getIntegrationsForForm;
const activateSheetsIntegration = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const formId = req.params.formId;
        const { spreadSheetName, googleUserId } = req.body;
        const form = (yield firebase_1.db.collection('Forms').doc(formId).get()).data();
        const integration = (yield firebase_1.db.collection('Automations').doc(formId).get()).data();
        if (form && integration) {
            const token = (yield firebase_1.db.collection('GoogleTokens').doc(googleUserId).get()).data();
            const authClient = yield (0, google_1.getGoogleAuthClient)();
            authClient.setCredentials({
                refresh_token: token.refreshToken,
            });
            const newSpreadsheetId = (yield (0, google_1.createNewGoogleSheet)(spreadSheetName, authClient));
            const columnTitles = [
                'Submitted at',
                ...form.fields.map((field) => field.title),
            ];
            yield (0, google_1.appendDataToSheet)(authClient, newSpreadsheetId, 'A:A', columnTitles);
            yield firebase_1.db
                .collection('Automations')
                .doc(formId)
                .update({
                ['googleSheets.enabled']: true,
                ['googleSheets.sheetId']: newSpreadsheetId,
                ['googleSheets.sheetName']: spreadSheetName,
                ['googleSheets.googleUserId']: googleUserId,
            });
            res.status(200).json({
                newSpreadsheetId,
                message: 'Google sheets integration activated!',
            });
        }
        else {
            throw new Error('Something went wrong');
        }
    }
    catch (error) {
        res.status(500).send('Internal server error');
    }
});
exports.activateSheetsIntegration = activateSheetsIntegration;
const disableSheetsIntegration = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const formId = req.params.formId;
        yield firebase_1.db
            .collection('Automations')
            .doc(formId)
            .update({
            ['googleSheets.enabled']: false,
            ['googleSheets.sheetId']: '',
            ['googleSheets.sheetName']: '',
            ['googleSheets.googleUserId']: '',
        });
        res.status(200).send('Sheets integration disabled');
    }
    catch (error) {
        res.status(500).send('Internal server error');
    }
});
exports.disableSheetsIntegration = disableSheetsIntegration;
const deleteGoogleSheetsAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const googleUserId = req.params.googleUserId;
        yield firebase_1.db.collection('GoogleTokens').doc(googleUserId).delete();
        res.status(200).send('Google sheets account deleted');
    }
    catch (error) {
        res.status(500).send('Internal server error');
    }
});
exports.deleteGoogleSheetsAccount = deleteGoogleSheetsAccount;
