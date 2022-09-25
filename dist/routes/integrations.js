"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const integrations_1 = require("../controllers/integrations");
const integrationsRouter = express_1.default.Router();
integrationsRouter.delete('/googleSheetsAccounts/:googleUserId', integrations_1.deleteGoogleSheetsAccount);
integrationsRouter.get('/:formId', integrations_1.getIntegrationsForForm);
integrationsRouter.post('/:formId/activateSheetsIntegration', integrations_1.activateSheetsIntegration);
integrationsRouter.post('/:formId/disableSheetsIntegration', integrations_1.disableSheetsIntegration);
exports.default = integrationsRouter;
