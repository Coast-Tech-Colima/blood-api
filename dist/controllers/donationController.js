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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getdonationApprovalRequestsByRequest = exports.getDonationApprovalRequestsByUser = exports.deleteDonationRequest = exports.updateDonationApprovalRequest = exports.createDonationApprovalRequest = void 0;
const donationRequest_schema_1 = __importDefault(require("../schemas/donationRequest.schema"));
const db_1 = require("../utils/db");
const createDonationApprovalRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validatedData = donationRequest_schema_1.default.safeParse(req.body);
    if (!validatedData.success) {
        return res.status(400).json(validatedData.error);
    }
    try {
        const _a = validatedData.data, { requestId } = _a, data = __rest(_a, ["requestId"]);
        const docRef = db_1.db.collection("donationsRequests").doc();
        yield docRef.set(Object.assign(Object.assign({ requestId }, data), { status: "pending" }));
        res
            .status(201)
            .json({ message: "Donation approval request created successfully" });
    }
    catch (error) {
        console.error("Error creating donation approval request:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.createDonationApprovalRequest = createDonationApprovalRequest;
const updateDonationApprovalRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const documentId = req.params.id; // Assuming the ID is passed as a URL parameter
    const validatedData = donationRequest_schema_1.default.safeParse(req.body);
    if (!validatedData.success) {
        return res.status(400).json(validatedData.error);
    }
    try {
        const docRef = db_1.db.collection("donationsRequests").doc(documentId);
        yield docRef.update(validatedData.data);
        res
            .status(200)
            .json({ message: "Donation approval request updated successfully" });
    }
    catch (error) {
        console.error("Error updating donation approval request:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.updateDonationApprovalRequest = updateDonationApprovalRequest;
const deleteDonationRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () { });
exports.deleteDonationRequest = deleteDonationRequest;
const getDonationApprovalRequestsByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.get("authToken");
        if (!token) {
            throw new Error("No auth token detected: Unauthorized");
        }
        const user = yield db_1.auth.verifyIdToken(token);
        const docRef = yield db_1.db.collection("donationRequests");
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
exports.getDonationApprovalRequestsByUser = getDonationApprovalRequestsByUser;
const getdonationApprovalRequestsByRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const requestId = req.query.requestId;
        if (!requestId) {
            return res.status(400).send("Missing requestId in request URL");
        }
        const docRef = yield db_1.db.collection("requests");
        const docSnapshot = yield docRef
            .where("requestId", "==", requestId)
            .get();
        if (docSnapshot.empty) {
            res.status(404).send("Request not found");
        }
        const result = [];
        docSnapshot.forEach((collection) => __awaiter(void 0, void 0, void 0, function* () {
            result.push(collection.data());
        }));
        res.status(200).send(result);
    }
    catch (error) {
        console.error("Error fetching request:", error);
        res.status(500).send("Internal Server Error");
    }
});
exports.getdonationApprovalRequestsByRequest = getdonationApprovalRequestsByRequest;
