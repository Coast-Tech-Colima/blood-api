import { Router } from 'express';
import {
  createDonationApprovalRequest,
  updateDonationApprovalRequest,
} from '../controllers/donationController';

const router = Router();

router.post('/donation-approval', createDonationApprovalRequest);
router.put('/donation-approval/:requestId', updateDonationApprovalRequest);
/* router.get('/donation-approval/user', getDonationApprovalRequestsByUser);
router.get('/donation-approval/request/:requestId', getdonationApprovalRequestsByRequest); */


export default router;