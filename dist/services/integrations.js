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
exports.addToIntegrationsQueue = void 0;
const tasks_1 = require("@google-cloud/tasks");
const client = new tasks_1.CloudTasksClient();
const addToIntegrationsQueue = (formId, answers, submittedAt) => __awaiter(void 0, void 0, void 0, function* () {
    const project = 'formbuilder-358116';
    const queue = 'forms-automations-queue';
    const location = 'europe-west1';
    const url = 'https://europe-west1-formbuilder-358116.cloudfunctions.net/handleAutomations';
    const parent = client.queuePath(project, location, queue);
    const [response] = yield client.createTask({
        parent: parent,
        task: {
            httpRequest: {
                httpMethod: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                url,
                oidcToken: {
                    serviceAccountEmail: 'formbuilder-358116@appspot.gserviceaccount.com',
                    audience: url,
                },
                body: Buffer.from(JSON.stringify({
                    formId,
                    answers,
                    submittedAt,
                })).toString('base64'),
            },
        },
    });
    console.log(`Created task for automations queue ${response}`);
});
exports.addToIntegrationsQueue = addToIntegrationsQueue;
