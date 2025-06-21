"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const donationApprovalRequestInputSchema = zod_1.z.object({
    requestId: zod_1.z.number().positive().min(1),
    name: zod_1.z.string().trim().min(1, { message: "Required" }),
    lastName: zod_1.z.string().trim().min(1, { message: "Required" }),
    motherSurname: zod_1.z.string().trim().min(1, { message: "Required" }),
    userId: zod_1.z.number().positive().min(1),
    city: zod_1.z.string().trim().min(1, { message: "Required" }).optional(),
    address: zod_1.z.string().trim().min(1, { message: "Required" }).optional(),
    status: zod_1.z.boolean(),
});
exports.default = donationApprovalRequestInputSchema;
