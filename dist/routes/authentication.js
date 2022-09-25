"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authentication_1 = require("../controllers/authentication");
const authenticationRouter = express_1.default.Router();
authenticationRouter.get('/googleAuth', authentication_1.googleAuth);
authenticationRouter.get('/googleAuthCallback', authentication_1.googleAuthCallback);
exports.default = authenticationRouter;
