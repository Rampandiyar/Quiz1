import Roles from "../Models/Role.js";
import { CreateSuccess } from "../Utilities/Success.js";
import { CreateError } from "../Utilities/Error.js";

export const createRole = async (req, res, next) => {
    try {
        if (!req.body.role || typeof req.body.role !== 'string' || req.body.role.trim() === '') {
            return next(CreateError(400, 'Role name is required and must be valid.'));
        }

        const newRole = new Roles(req.body);
        await newRole.save();
        return res.status(200).json(CreateSuccess(200, 'Role created successfully', newRole));
    } catch (error) {
        console.error('Error:', error);
        return next(CreateError(500, 'Error in Code'));
    }
};

export const updateRole = async (req, res, next) => {
    try {
        const role = await Roles.findById(req.params.id);
        if (!role) {
            return next(CreateError(404, 'Role not found'));
        }

        const updatedRole = await Roles.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );

        return res.status(200).json(CreateSuccess(200, 'Role updated successfully', updatedRole));
    } catch (error) {
        console.error('Error:', error);
        return next(CreateError(500, 'Internal error'));
    }
};

export const getAllRoles = async (req, res, next) => {
    try {
        const roles = await Roles.find({});
        if (roles.length === 0) {
            return res.status(404).json(CreateError(404, 'No roles found'));
        }

        return res.status(200).json(CreateSuccess(200, 'Roles fetched successfully', roles));
    } catch (error) {
        console.error('Error:', error);
        return next(CreateError(500, 'Internal error'));
    }
};

export const deleteRole = async (req, res, next) => {
    try {
        const role = await Roles.findByIdAndDelete(req.params.id);
        if (!role) {
            return next(CreateError(400, 'Role not found'));
        }

        return res.status(200).json(CreateSuccess(200, 'Role deleted successfully'));
    } catch (error) {
        console.error('Error:', error);
        return next(CreateError(500, 'Internal error'));
    }
};
