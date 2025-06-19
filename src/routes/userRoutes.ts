import { Router } from 'express';
import { createUser, getUsers, getUserInfo } from '../controllers/userController';

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
// /* router.put('/:documentId', editUser);
// router.get('/user', getUsersByUser);
// router.get('/bloodTypeAndLocation', getUsersByBloodTypeAndLocation); */  

export default router;