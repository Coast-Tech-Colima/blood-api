import { z } from 'zod';

const donationApprovalRequestInputSchema = z.object({
    requestId: z.number().positive().min(1),
    name: z.string().trim().min(1, { message: 'Required' }),
    lastName: z.string().trim().min(1, { message: 'Required' }),
    motherSurname: z.string().trim().min(1, { message: 'Required' }),
    userId: z.number().positive().min(1),
    city: z.string().trim().min(1, { message: 'Required' }).optional(),
    address: z.string().trim().min(1, { message: 'Required' }).optional(),
    status: z.boolean()
});
export default donationApprovalRequestInputSchema