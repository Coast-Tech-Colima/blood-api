import { Router } from 'express';
import {
  createDonationApprovalRequest,
  getdonationApprovalRequestsByRequest,
  getDonationApprovalRequestsByUser,
  updateDonationApprovalRequest,
} from '../controllers/donationController';

const router = Router();

router.post('/', createDonationApprovalRequest);
router.put('/:requestId', updateDonationApprovalRequest);
router.get('/user', getDonationApprovalRequestsByUser);
router.get('/request/:requestId', getdonationApprovalRequestsByRequest);


export default router;