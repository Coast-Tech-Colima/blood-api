import { Router } from 'express';
import { createUser, getUsers, getUserInfo,updateUserFile, editUserInfo} from '../controllers/userController';

const router = Router();

router.post('/users', createUser);
/**
 * @openapi
 * /api/users:
 *   get:
 *     summary: Get all users
 *     responses:
 *       200:
 *         description: A list of users
 */
router.get('/', getUsers);
router.get('/:id', getUserInfo);
router.post('/', createUser);
router.put('/:documentId', editUserInfo);
router.post('/documents/', updateUserFile);
router.put('/documents/', updateUserFile);

export default router;