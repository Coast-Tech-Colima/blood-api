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

router.post('/', createRequest);
router.get('/', getRequests);
router.get('/:id', getRequestById);
router.put('/:documentId', editRequest);
router.get('/user/requests', getRequestsByUser);
router.get('/bloodTypeAndLocation/requests', getRequestByBloodTypeAndLocation);

export default router;  