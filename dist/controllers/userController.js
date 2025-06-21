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
exports.getUserInfo = exports.getUsers = exports.createUser = void 0;
const user_schema_1 = __importDefault(require("../schemas/user.schema"));
const db_1 = require("../utils/db");
;
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedData = user_schema_1.default.safeParse(req.body);
        if (validatedData.success) {
            const data = validatedData.data;
            const docRef = db_1.db.collection('users').doc();
            yield docRef.set(data);
            res.status(200).send('Data inserted successfully');
        }
        else {
            res.status(400).send(validatedData.error);
        }
    }
    catch (error) {
        console.error('Error inserting data:', error);
        res.status(500).send(error);
    }
});
exports.createUser = createUser;
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const usersSnapshot = yield db_1.db.collection('users').get();
        const data = usersSnapshot.docs.map((doc) => doc.data());
        res.status(200).send(data);
    }
    catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Internal Server Error');
    }
});
exports.getUsers = getUsers;
const getUserInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const usersSnapshot = yield db_1.db.collection('users').get();
        const data = usersSnapshot.docs.map((doc) => doc.data());
        res.status(200).send(data);
    }
    catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Internal Server Error');
    }
});
exports.getUserInfo = getUserInfo;
