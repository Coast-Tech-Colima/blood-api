import { Router } from 'express';
import {
  createDonationApprovalRequest,
  getdonationApprovalRequestsByRequest,
  getDonationApprovalRequestsByUser,
  updateDonationApprovalRequest,
} from '../controllers/donationController';

const router = Router();

/**
 * @openapi
 * /api/donations:
 *   post:
 *     summary: Create a donation approval request
 *     tags:
 *       - Donations
 *     responses:
 *       201:
 *         description: Donation approval request created
 */
router.post('/', createDonationApprovalRequest);

/**
 * @openapi
 * /api/donations/{requestId}:
 *   put:
 *     summary: Update a donation approval request
 *     tags:
 *       - Donations
 *     parameters:
 *       - in: path
 *         name: requestId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Donation approval request updated
 */
router.put('/:requestId', updateDonationApprovalRequest);

/**
 * @openapi
 * /api/donations/user:
 *   get:
 *     summary: Get donation approval requests for the current user
 *     tags:
 *       - Donations
 *     responses:
 *       200:
 *         description: List of donation approval requests
 */
router.get('/user', getDonationApprovalRequestsByUser);

/**
 * @openapi
 * /api/donations/request/{requestId}:
 *   get:
 *     summary: Get donation approval requests by request ID
 *     tags:
 *       - Donations
 *     parameters:
 *       - in: path
 *         name: requestId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Donation approval requests for the specified request
 */
router.get('/request/:requestId', getdonationApprovalRequestsByRequest);

export default router;

