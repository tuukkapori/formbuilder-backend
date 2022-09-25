"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authentication_1 = require("../controllers/authentication");
const public_1 = require("../controllers/public");
const publicRouter = express_1.default.Router();
publicRouter.get('/forms/:formId', public_1.getFormPublic);
publicRouter.post('/submit/:formId', public_1.submitForm);
publicRouter.get('/googleAuth', authentication_1.googleAuth);
publicRouter.get('/googleAuthCallback', authentication_1.googleAuthCallback);
exports.default = publicRouter;
