"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const userSchema = zod_1.z.object({
    id: zod_1.z.number().positive().min(1),
    name: zod_1.z.string().trim().min(1, { message: 'Required' }),
    lastName: zod_1.z.string().trim().min(1, { message: 'Required' }),
    motherSurname: zod_1.z.string().trim().min(1, { message: 'Required' }),
    bloodType: zod_1.z.string().trim().min(1, { message: 'Required' }),
    userId: zod_1.z.number().positive().min(1),
    genre: zod_1.z.string().trim().min(1, { message: 'Required' }),
    birthDate: zod_1.z.string().trim().min(1, { message: 'Required' }).optional(),
    city: zod_1.z.string().trim().min(1, { message: 'Required' }).optional(),
    address: zod_1.z.string().trim().min(1, { message: 'Required' }).optional(),
    idFile: zod_1.z.string().email().optional(),
    profilePicture: zod_1.z.string().optional(),
    approvedDonationCounter: zod_1.z.number().positive().min(1),
    radioDistancePreference: zod_1.z.string().optional(),
});
exports.default = userSchema;
//# sourceMappingURL=user.schema.js.map