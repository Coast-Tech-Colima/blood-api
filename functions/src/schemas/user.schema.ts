import { z } from 'zod';

const userInptSchema = z.object({
    id: z.number().positive().min(1),
    name: z.string().trim().min(1, { message: 'Required' }),
    lastName: z.string().trim().min(1, { message: 'Required' }),
    motherSurname: z.string().trim().min(1, { message: 'Required' }),
    bloodType: z.string().trim().min(1, { message: 'Required' }),
    userId: z.number().positive().min(1),
    genre: z.string().date().trim().min(1, { message: 'Required' }),
    birthDate: z.string().trim().min(1, { message: 'Required' }).optional(),
    city: z.string().trim().min(1, { message: 'Required' }).optional(),
    address: z.string().trim().min(1, { message: 'Required' }).optional(),
    idFile: z.string().email().optional(),
    profilePicture: z.string().optional(),
    approvedDonationCounter: z.number().positive().min(1),
    radioDistancePreferenc: z.string().optional(),
});
export default userInptSchema