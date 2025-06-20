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
exports.getRequestByBloodTypeAndLocation = exports.editRequest = exports.getRequestsByUser = exports.getRequestById = exports.getRequests = exports.createRequest = void 0;
const request_schema_1 = __importDefault(require("../schemas/request.schema"));
const db_1 = require("../utils/db");
const distance_1 = require("../utils/distance");
const createRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedData = request_schema_1.default.safeParse(req.body);
        if (!validatedData.success) {
            return res.status(400).json(validatedData.error);
        }
        const data = validatedData.data;
        const docRef = db_1.db.collection("requests").doc();
        yield docRef.set(data);
        res
            .status(201)
            .json({ message: "Request created successfully", id: docRef.id });
    }
    catch (error) {
        console.error("Error creating request:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.createRequest = createRequest;
const getRequests = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const requestsSnapshot = yield db_1.db.collection("requests").get();
        const requests = requestsSnapshot.docs.map((doc) => (Object.assign({ id: doc.id }, doc.data())));
        res.status(200).json(requests);
    }
    catch (error) {
        console.error("Error fetching requests:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.getRequests = getRequests;
const getRequestById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const requestId = req.params.id;
        const docRef = db_1.db.collection("requests").doc(requestId);
        const doc = yield docRef.get();
        if (!doc.exists) {
            return res.status(404).json({ error: "Request not found" });
        }
        res.status(200).json(Object.assign({ id: doc.id }, doc.data()));
    }
    catch (error) {
        console.error("Error fetching request:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.getRequestById = getRequestById;
const getRequestsByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.get("authToken");
        if (!token) {
            throw new Error("No auth token detected: Unauthorized");
        }
        const user = yield db_1.auth.verifyIdToken(token);
        const docRef = yield db_1.db.collection("requests");
        const docSnapshot = yield docRef.where("userId", "==", user.uid).get();
        if (docSnapshot.empty) {
            res.status(404).send("Request not found");
        }
        const result = [];
        docSnapshot.forEach((collection) => {
            result.push(collection.data());
        });
        res.status(200).send(result);
    }
    catch (error) {
        console.error("Error fetching request:", error);
        res.status(500).send("Internal Server Error");
    }
});
exports.getRequestsByUser = getRequestsByUser;
const editRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const documentId = req.query.documentId;
        const validatedData = request_schema_1.default.safeParse(req.body);
        if (validatedData.success) {
            const data = validatedData.data;
            if (!documentId) {
                return res.status(400).send('Missing document ID or updated data');
            }
            const querySnapshot = yield db_1.db
                /* eslint-disable indent */
                .collection('requests')
                /* eslint-disable indent */
                .where('id', '==', documentId)
                /* eslint-disable indent */
                .get();
            if (querySnapshot.empty) {
                return res.status(404).send('Document not found');
            }
            const docRef = querySnapshot.docs[0].ref;
            yield docRef.update(data);
            res.status(200).send('Data inserted successfully yedd==eaaah');
        }
        else {
            res.status(400).send(validatedData.error);
        }
    }
    catch (error) {
        console.error('Error editing document:', error);
        res.status(500).send('Internal server error');
    }
});
exports.editRequest = editRequest;
const getRequestByBloodTypeAndLocation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bloodType = req.query.bloodType;
        const lng = req.query.lng;
        const lat = req.query.lat;
        const rateLimit = 8;
        if (!bloodType) {
            return res.status(400).send('Missing bloodType in request URL');
        }
        const docRef = yield db_1.db.collection('requests');
        const docSnapshot = yield docRef
            .where('bloodType', '==', bloodType)
            .get();
        if (docSnapshot.empty) {
            res.status(404).send('Request not found');
        }
        const todayDate = new Date();
        const result = [];
        docSnapshot.forEach((collection) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const collectionData = collection.data();
            const deadlineDate = new Date(collectionData.dueDate);
            if (deadlineDate < todayDate) {
                return;
            }
            if (!(collectionData === null || collectionData === void 0 ? void 0 : collectionData.location)) {
                return;
            }
            if (lat && lng) {
                const distance = (0, distance_1.haversineDistance)(lat, lng, (_a = collectionData === null || collectionData === void 0 ? void 0 : collectionData.location) === null || _a === void 0 ? void 0 : _a.lat, collectionData === null || collectionData === void 0 ? void 0 : collectionData.location.lng);
                if (distance > rateLimit) {
                    return;
                }
            }
            result.push(collection.data());
        }));
        res.status(200).send(result);
    }
    catch (error) {
        console.error('Error fetching request:', error);
        res.status(500).send('Internal Server Error');
    }
});
exports.getRequestByBloodTypeAndLocation = getRequestByBloodTypeAndLocation;
