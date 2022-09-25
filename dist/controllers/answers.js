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
exports.getAnswersForForm = void 0;
const firebase_1 = require("../services/firebase");
const forms_1 = require("../services/forms");
const getAnswersForForm = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const formId = req.params.formId;
        yield (0, forms_1.validateUserAccessToForm)(formId, req.userId);
        const result = yield firebase_1.db
            .collection('AllAnswers')
            .doc(formId)
            .collection('Answers')
            .get();
        if (!result.empty) {
            const answersArray = [];
            result.forEach((ans) => {
                answersArray.push(ans.data());
            });
            const unNested = answersArray.map((ans) => {
                const answers = {
                    submittedAt: ans.submittedAt,
                };
                Object.keys(ans.answers).map((key) => {
                    answers[key] = ans.answers[key];
                });
                return answers;
            });
            const sorted = unNested.sort((a, b) => a.submittedAt - b.submittedAt);
            res.status(200).json(sorted);
        }
        else {
            res.status(200).json([]);
        }
    }
    catch (error) {
        res.status(500).send('Internal server error');
    }
});
exports.getAnswersForForm = getAnswersForForm;
