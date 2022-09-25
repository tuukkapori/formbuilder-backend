"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const forms_1 = require("../controllers/forms");
const formsRouter = express_1.default.Router();
formsRouter.get('/', forms_1.getForms);
formsRouter.post('/', forms_1.createForm);
formsRouter.get('/:formId', forms_1.getForm);
formsRouter.put('/:formId', forms_1.updateForm);
formsRouter.delete('/:formId', forms_1.deleteForm);
exports.default = formsRouter;
