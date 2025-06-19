import { z } from 'zod';

const requestInputSchema = z.object({
    name: z.string().trim().min(1, { message: 'Required' }),
    lastName: z.string().trim().min(1, { message: 'Required' }),
    motherSurname: z.string().trim().min(1, { message: 'Required' }),
    bloodType: z.string().trim().min(1, { message: 'Required' }),
    unitsRequired: z.number().positive().min(1),
    dueDate: z.string().date().trim().min(1, { message: 'Required' }),
    reason: z.string().trim().min(1, { message: 'Required' }),
    place: z.string().trim().min(1, { message: 'Required' }),
    phone: z.string().trim().min(1, { message: 'Required' }),
    email: z.string().email(),
    folio: z.string().trim().min(1, { message: 'Required' }),
    preferedContact: z.string().trim().min(1, { message: 'Required' }),
    donationCounter: z.number().positive().min(1),
    img: z.string().optional(),
});

export default requestInputSchema;