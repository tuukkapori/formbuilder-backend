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
exports.createForm = exports.deleteForm = exports.updateForm = exports.getForms = exports.getForm = void 0;
const firebase_1 = require("../services/firebase");
const forms_1 = require("../services/forms");
const getForm = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const formId = req.params.formId;
        yield (0, forms_1.validateUserAccessToForm)(formId, req.userId);
        const form = yield firebase_1.db.collection('Forms').doc(formId).get();
        res.status(200).json(form.data());
    }
    catch (error) {
        res.status(500).send('Internal server error');
    }
});
exports.getForm = getForm;
const getForms = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield firebase_1.db
            .collection('Forms')
            .where('userId', '==', req.userId)
            .get();
        const forms = {};
        result.forEach((form) => {
            forms[form.id] = form.data();
        });
        res.status(200).json(forms);
    }
    catch (error) {
        res.status(500).send('Internal server error');
    }
});
exports.getForms = getForms;
const createForm = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { form } = req.body;
        const userId = req.userId;
        const formWithUserId = Object.assign(Object.assign({}, form), { userId });
        const newFormDocument = yield firebase_1.db.collection('Forms').add(formWithUserId);
        const formId = newFormDocument.id;
        // initialize automations
        yield firebase_1.db
            .collection('Automations')
            .doc(formId)
            .set({
            email: {
                enabled: false,
                fieldIdForEmail: '',
                fieldIdForName: '',
                mailerliteGroupId: '',
            },
            googleSheets: {
                enabled: false,
                sheetId: '',
                sheetName: '',
                tokenId: '',
            },
            maxCapacity: -1,
            userId,
        });
        const formResult = yield newFormDocument.get();
        res.status(200).json({ formId, form: formResult.data() });
    }
    catch (error) {
        res.status(500).send('Internal server error');
    }
});
exports.createForm = createForm;
const updateForm = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const formId = req.params.formId;
        const { form } = req.body;
        yield (0, forms_1.validateUserAccessToForm)(formId, req.userId);
        yield firebase_1.db.collection('Forms').doc(formId).update(form);
        res.status(200).send('Form updated');
    }
    catch (error) {
        res.status(500).send('Internal server error');
    }
});
exports.updateForm = updateForm;
const deleteForm = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const formId = req.params.formId;
        yield (0, forms_1.validateUserAccessToForm)(formId, req.userId);
        yield Promise.all([
            firebase_1.db.collection('Forms').doc(formId).delete(),
            firebase_1.db.collection('Automations').doc(formId).delete(),
        ]);
        const answers = yield firebase_1.db
            .collection('AllAnswers')
            .doc(formId)
            .collection('Answers')
            .get();
        answers.forEach((doc) => doc.ref.delete());
        res.status(200).send('Form deleted');
    }
    catch (error) {
        res.status(500).send('Internal server error');
    }
});
exports.deleteForm = deleteForm;
