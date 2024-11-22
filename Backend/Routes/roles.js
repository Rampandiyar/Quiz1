import express from 'express';
import { createRole, deleteRole, getAllRoles, updateRole } from '../Controllers/roles.controller.js';

const router = express.Router();

router.post("/create", createRole);
router.put('/update/:id', updateRole);
router.get('/getAll', getAllRoles);
router.delete('/delete/:id', deleteRole);

export default router;