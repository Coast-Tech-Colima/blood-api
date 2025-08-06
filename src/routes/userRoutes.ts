import { Router } from 'express';
import {
  createUser,
  getUsers,
  getUserInfo,
  updateUserFile,
  editUserInfo,
  deleteUserFilesInfo,
} from '../controllers/userController';

const router = Router();

/**
 * @openapi
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: A list of users
 */
router.get('/', getUsers);

/**
 * @openapi
 * /api/users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User information retrieved
 */
router.get('/:id', getUserInfo);

/**
 * @openapi
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags:
 *       - Users
 *     responses:
 *       201:
 *         description: User created
 */
router.post('/', createUser);

/**
 * @openapi
 * /api/users/{userId}:
 *   put:
 *     summary: Edit user information
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User information updated
 */
router.put('/:userId', editUserInfo);

/**
 * @openapi
 * /api/users/documents:
 *   post:
 *     summary: Update user documents
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: Documents updated
 */
router.post('/documents/', updateUserFile);

/**
 * @openapi
 * /api/users/documents:
 *   delete:
 *     summary: Delete user documents
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: Documents deleted
 */
router.delete('/documents/', deleteUserFilesInfo);

export default router;

