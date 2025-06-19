"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserInfo = exports.getUsers = exports.createUser = void 0;
const user_schema_1 = __importDefault(require("../schemas/user.schema"));
const db_1 = require("../utils/db");
;
const createUser = async (req, res) => {
    try {
        const validatedData = user_schema_1.default.safeParse(req.body);
        if (validatedData.success) {
            const data = validatedData.data;
            const docRef = db_1.db.collection('users').doc();
            await docRef.set(data);
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
};
exports.createUser = createUser;
const getUsers = async (req, res) => {
    try {
        const usersSnapshot = await db_1.db.collection('users').get();
        const data = usersSnapshot.docs.map((doc) => doc.data());
        res.status(200).send(data);
    }
    catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Internal Server Error');
    }
};
exports.getUsers = getUsers;
const getUserInfo = async (req, res) => {
    try {
        const usersSnapshot = await db_1.db.collection('users').get();
        const data = usersSnapshot.docs.map((doc) => doc.data());
        res.status(200).send(data);
    }
    catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Internal Server Error');
    }
};
exports.getUserInfo = getUserInfo;
//# sourceMappingURL=userController.js.map