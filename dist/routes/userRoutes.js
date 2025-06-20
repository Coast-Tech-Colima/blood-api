"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const router = (0, express_1.Router)();
router.post('/users', userController_1.createUser);
/**
 * @openapi
 * /api/users:
 *   get:
 *     summary: Get all users
 *     responses:
 *       200:
 *         description: A list of users
 */
router.get('/', userController_1.getUsers);
router.get('/:id', userController_1.getUserInfo);
// /* router.put('/:documentId', editUser);
// router.get('/user', getUsersByUser);
// router.get('/bloodTypeAndLocation', getUsersByBloodTypeAndLocation); */  
exports.default = router;
