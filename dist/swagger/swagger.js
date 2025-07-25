"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Blood API',
            version: '1.0.0',
            description: 'API documentation for Blood API',
        },
        servers: [
            { url: 'http://localhost:3000' },
            { url: 'https://blood-api.vercel.app' }
        ],
    },
    apis: ['src/routes/*.ts', 'src/controllers/*.ts'], // <-- No leading ./
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
exports.default = swaggerSpec;
