import { Router } from 'express';
import {
  createDonationApprovalRequest,
  getdonationApprovalRequestsByRequest,
  getDonationApprovalRequestsByUser,
  updateDonationApprovalRequest,
} from '../controllers/donationController';
import { db } from '../utils/db';

const router = Router();

router.post('/', createDonationApprovalRequest);
router.put('/:requestId', updateDonationApprovalRequest);
router.get('/user', getDonationApprovalRequestsByUser);
router.get('/request/:requestId', getdonationApprovalRequestsByRequest);

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('donationsRequests').doc(id).delete();
    res
      .status(200)
      .json({ message: 'Donation approval request deleted successfully' });
  } catch (error) {
    console.error('Error deleting donation approval request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


export default router;