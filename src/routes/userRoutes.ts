import { Router } from 'express';
import { createUser, getUsers, getUserInfo,updateUserFile, editUserInfo, deleteUserFilesInfo} from '../controllers/userController';

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
/* router.get('/profile', getCurrentUserInfo); // Assuming this function is defined in userController
 */router.put('/:userId', editUserInfo);
router.post('/documents/', updateUserFile);
router.delete('/documents/', deleteUserFilesInfo);

export default router;