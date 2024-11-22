import jwt from 'jsonwebtoken';
import { CreateError } from './Error.js';

export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token || req.cookies.admin_token; // Support both user and admin tokens
    if (!token) {
        return next(CreateError(401, "Access denied. No token provided."));
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return next(CreateError(401, "Token has expired. Please log in again."));
            }
            return next(CreateError(403, "Access denied. Invalid token."));
        }
        req.user = user;
        next();
    });
};

export const verifyUser = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.id === req.params.id || req.user.isAdmin) {
            next();
        } else {
            return next(CreateError(403, "You are not authorized."));
        }
    });
};

export const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.isAdmin) {
            next();
        } else {
            return next(CreateError(403, "You are not allowed to access this resource."));
        }
    });
};
