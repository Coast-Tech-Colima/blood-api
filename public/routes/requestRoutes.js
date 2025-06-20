"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const requestController_1 = require("../controllers/requestController");
const router = (0, express_1.Router)();
router.post('/', requestController_1.createRequest);
router.get('/', requestController_1.getRequests);
router.get('/:id', requestController_1.getRequestById);
/* router.put('/:documentId', editRequest);
router.get('/user', getRequestsByUser);
router.get('/bloodTypeAndLocation', getRequestByBloodTypeAndLocation); */
exports.default = router;
//# sourceMappingURL=requestRoutes.js.map