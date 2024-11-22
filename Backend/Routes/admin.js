import express from "express";
import { adminLogin, createAdmin } from "../Controllers/admin.controller.js";
import Admin from "../Models/Admin.js";



const router = express.Router();

router.post('/ad-regis', createAdmin);
router.post('/ad-login', adminLogin);

export default router;