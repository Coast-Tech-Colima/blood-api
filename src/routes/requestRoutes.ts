import { Router } from 'express';
import {
  createRequest,
  getRequests,
  getRequestById,
  editRequest,
  getRequestsByUser,
  getRequestByBloodTypeAndLocation,
} from '../controllers/requestController';

const router = Router();

/**
 * @openapi
 * /api/requests:
 *   post:
 *     summary: Create a new request
 *     tags:
 *       - Requests
 *     responses:
 *       201:
 *         description: Request created
 */
router.post('/', createRequest);

/**
 * @openapi
 * /api/requests:
 *   get:
 *     summary: Get all requests
 *     tags:
 *       - Requests
 *     responses:
 *       200:
 *         description: List of requests
 */
router.get('/', getRequests);

/**
 * @openapi
 * /api/requests/{id}:
 *   get:
 *     summary: Get a request by ID
 *     tags:
 *       - Requests
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Request retrieved
 */
router.get('/:id', getRequestById);

/**
 * @openapi
 * /api/requests/{documentId}:
 *   put:
 *     summary: Edit a request
 *     tags:
 *       - Requests
 *     parameters:
 *       - in: path
 *         name: documentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Request updated
 */
router.put('/:documentId', editRequest);

/**
 * @openapi
 * /api/requests/user/requests:
 *   get:
 *     summary: Get requests by user
 *     tags:
 *       - Requests
 *     responses:
 *       200:
 *         description: List of user's requests
 */
router.get('/user/requests', getRequestsByUser);

/**
 * @openapi
 * /api/requests/bloodTypeAndLocation/requests:
 *   get:
 *     summary: Get requests by blood type and location
 *     tags:
 *       - Requests
 *     responses:
 *       200:
 *         description: List of matching requests
 */
router.get('/bloodTypeAndLocation/requests', getRequestByBloodTypeAndLocation);

export default router;

