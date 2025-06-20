"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const donationController_1 = require("../controllers/donationController");
const router = (0, express_1.Router)();
router.post('/donation-approval', donationController_1.createDonationApprovalRequest);
router.put('/donation-approval/:requestId', donationController_1.updateDonationApprovalRequest);
/* router.get('/donation-approval/user', getDonationApprovalRequestsByUser);
router.get('/donation-approval/request/:requestId', getdonationApprovalRequestsByRequest); */
exports.default = router;
//# sourceMappingURL=donationRoutes.js.map