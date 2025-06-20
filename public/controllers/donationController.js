"use strict";
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
const createDonationApprovalRequest = async (req, res) => {
    const validatedData = donationRequest_schema_1.default.safeParse(req.body);
    if (!validatedData.success) {
        return res.status(400).json(validatedData.error);
    }
    try {
        const _a = validatedData.data, { requestId } = _a, data = __rest(_a, ["requestId"]);
        const docRef = db_1.db.collection("donationsRequests").doc();
        await docRef.set(Object.assign(Object.assign({ requestId }, data), { status: "pending" }));
        res
            .status(201)
            .json({ message: "Donation approval request created successfully" });
    }
    catch (error) {
        console.error("Error creating donation approval request:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.createDonationApprovalRequest = createDonationApprovalRequest;
const updateDonationApprovalRequest = async (req, res) => {
    const documentId = req.params.id; // Assuming the ID is passed as a URL parameter
    const validatedData = donationRequest_schema_1.default.safeParse(req.body);
    if (!validatedData.success) {
        return res.status(400).json(validatedData.error);
    }
    try {
        const docRef = db_1.db.collection("donationsRequests").doc(documentId);
        await docRef.update(validatedData.data);
        res
            .status(200)
            .json({ message: "Donation approval request updated successfully" });
    }
    catch (error) {
        console.error("Error updating donation approval request:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.updateDonationApprovalRequest = updateDonationApprovalRequest;
const deleteDonationRequest = async (req, res) => { };
exports.deleteDonationRequest = deleteDonationRequest;
const getDonationApprovalRequestsByUser = async (req, res) => {
    try {
        const token = req.get("authToken");
        if (!token) {
            throw new Error("No auth token detected: Unauthorized");
        }
        const user = await db_1.auth.verifyIdToken(token);
        const docRef = await db_1.db.collection("donationRequests");
        const docSnapshot = await docRef.where("userId", "==", user.uid).get();
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
};
exports.getDonationApprovalRequestsByUser = getDonationApprovalRequestsByUser;
const getdonationApprovalRequestsByRequest = async (req, res) => {
    try {
        const requestId = req.query.requestId;
        if (!requestId) {
            return res.status(400).send("Missing requestId in request URL");
        }
        const docRef = await db_1.db.collection("requests");
        const docSnapshot = await docRef
            .where("requestId", "==", requestId)
            .get();
        if (docSnapshot.empty) {
            res.status(404).send("Request not found");
        }
        const result = [];
        docSnapshot.forEach(async (collection) => {
            result.push(collection.data());
        });
        res.status(200).send(result);
    }
    catch (error) {
        console.error("Error fetching request:", error);
        res.status(500).send("Internal Server Error");
    }
};
exports.getdonationApprovalRequestsByRequest = getdonationApprovalRequestsByRequest;
//# sourceMappingURL=donationController.js.map