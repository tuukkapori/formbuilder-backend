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
exports.submitForm = exports.getFormPublic = void 0;
const axios_1 = __importDefault(require("axios"));
const firebase_1 = require("../services/firebase");
const forms_1 = require("../services/forms");
const getFormPublic = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const formId = req.params.formId;
    const result = yield firebase_1.db.collection('Forms').doc(formId).get();
    const form = result.data();
    if (form && form.status === 'open') {
        delete form.userId;
        res.status(200).json({ form });
    }
    else {
        res.status(404).end();
    }
});
exports.getFormPublic = getFormPublic;
const submitForm = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const formId = req.params.formId;
        yield (0, forms_1.validateIsFormOpen)(formId);
        const { answers } = req.body;
        const submittedAt = Date.now();
        const submission = { formId, submittedAt, answers };
        console.log('saving submission');
        yield firebase_1.db
            .collection('AllAnswers')
            .doc(formId)
            .collection('Answers')
            .add(submission);
        console.log('submission succes');
        const formDoc = yield firebase_1.db.collection('Forms').doc(formId).get();
        const formOwner = (_a = formDoc.data()) === null || _a === void 0 ? void 0 : _a.userId;
        try {
            yield axios_1.default.post(process.env.PUBSUB_SERVER_BASE_URL + '/submission/' + formId, {
                apiToken: process.env.SUBMISSION_API_TOKEN,
                answers: submission,
                userId: formOwner,
            });
        }
        catch (error) {
            console.log('Error sending submission to pubsub server!');
        }
        res.status(200).send('Form submitted!');
    }
    catch (error) {
        res.status(500).send('Error submitting form');
    }
});
exports.submitForm = submitForm;
