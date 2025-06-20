"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const requestInputSchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(1, { message: 'Required' }),
    lastName: zod_1.z.string().trim().min(1, { message: 'Required' }),
    motherSurname: zod_1.z.string().trim().min(1, { message: 'Required' }),
    bloodType: zod_1.z.string().trim().min(1, { message: 'Required' }),
    unitsRequired: zod_1.z.number().positive().min(1),
    dueDate: zod_1.z.string().date().trim().min(1, { message: 'Required' }),
    reason: zod_1.z.string().trim().min(1, { message: 'Required' }),
    place: zod_1.z.string().trim().min(1, { message: 'Required' }),
    phone: zod_1.z.string().trim().min(1, { message: 'Required' }),
    email: zod_1.z.string().email(),
    folio: zod_1.z.string().trim().min(1, { message: 'Required' }),
    preferedContact: zod_1.z.string().trim().min(1, { message: 'Required' }),
    donationCounter: zod_1.z.number().positive().min(1),
    img: zod_1.z.string().optional(),
});
exports.default = requestInputSchema;
//# sourceMappingURL=request.schema.js.map