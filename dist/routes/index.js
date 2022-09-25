"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const firebase_1 = require("../services/firebase");
const answersRouter_1 = __importDefault(require("./answersRouter"));
const authentication_1 = __importDefault(require("./authentication"));
const formsRouter_1 = __importDefault(require("./formsRouter"));
const integrations_1 = __importDefault(require("./integrations"));
const mainRouter = express_1.default.Router();
mainRouter.use(firebase_1.authenticateFirebaseUser);
mainRouter.use('/forms', formsRouter_1.default);
mainRouter.use('/integrations', integrations_1.default);
mainRouter.use('/answers', answersRouter_1.default);
mainRouter.use('/authentication', authentication_1.default);
exports.default = mainRouter;
