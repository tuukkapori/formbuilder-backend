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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleAuthCallback = exports.googleAuth = void 0;
const google_1 = require("../services/google");
const axios_1 = __importDefault(require("axios"));
const firebase_1 = require("../services/firebase");
const googleAuth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const oauthClient = yield (0, google_1.getGoogleAuthClient)();
        const scopes = [
            'https://www.googleapis.com/auth/spreadsheets',
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email',
        ];
        const userId = req.query.userId;
        const authToken = req.query.authToken;
        const redirectURL = process.env.CLOUDRUN_API_BASE_URL + '/public/googleAuthCallback';
        const authorizationUrl = oauthClient.generateAuthUrl({
            access_type: 'offline',
            scope: scopes,
            include_granted_scopes: true,
            redirect_uri: redirectURL,
            state: `${userId},${authToken}`,
        });
        res.redirect(authorizationUrl);
    }
    catch (error) {
        res.status(500).send('Internal server error');
    }
});
exports.googleAuth = googleAuth;
const googleAuthCallback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const error = req.query.error;
        const [userId, authToken] = ((_a = req.query) === null || _a === void 0 ? void 0 : _a.state).split(',');
        if (error) {
            res.status(500).send('Access denied most likely');
        }
        const code = req.query.code;
        if (code && typeof code === 'string') {
            const oauthClient = yield (0, google_1.getGoogleAuthClient)();
            const { tokens } = yield oauthClient.getToken(code);
            oauthClient.setCredentials(tokens);
            const data = yield (0, google_1.getUserData)(oauthClient);
            if (data.id && tokens.refresh_token) {
                yield firebase_1.db
                    .collection('GoogleTokens')
                    .doc(data.id)
                    .set({ refreshToken: tokens.refresh_token, userId });
            }
            else {
                console.log('No refresh token found');
            }
            // send user details to pub sub server
            yield axios_1.default.post(process.env.PUBSUB_SERVER_BASE_URL + '/googleAuth/' + userId, {
                data,
            }, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });
            res.status(200).send('Success!');
        }
        else {
            res.status(500).json({
                message: 'Code invalid',
            });
        }
    }
    catch (error) {
        console.log('Error in google auth callback ', error.message);
        res.status(500).send('Internal server error');
    }
});
exports.googleAuthCallback = googleAuthCallback;
