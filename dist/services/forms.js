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
exports.validateIsFormOpen = exports.validateUserAccessToForm = void 0;
const firebase_1 = require("./firebase");
const validateUserAccessToForm = (formId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield firebase_1.db.collection('Forms').doc(formId).get();
    const form = res.data();
    if (form && form.userId === userId) {
        return true;
    }
    else {
        throw new Error('User does not have access to this form!');
    }
});
exports.validateUserAccessToForm = validateUserAccessToForm;
const validateIsFormOpen = (formId) => __awaiter(void 0, void 0, void 0, function* () {
    const formDocument = yield firebase_1.db.collection('Forms').doc(formId).get();
    const form = formDocument.data();
    if (form && form.status === 'open') {
        return true;
    }
    else {
        throw new Error('Form is closed');
    }
});
exports.validateIsFormOpen = validateIsFormOpen;
