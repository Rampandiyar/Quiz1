import mongoose, { Schema } from "mongoose";

const AdminSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    staffId: {
        type: String,
        required: true,
        unique: true, // Ensures no duplicate staff IDs
    },
    email: {
        type: String,
        required: true,
        unique: true, // Ensures no duplicate emails
    },
    password: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: true,
    },
    roles: [
        {
            type: Schema.Types.ObjectId,
            ref: "Role",
        },
    ],
}, { timestamps: true });

export default mongoose.model("Admin", AdminSchema);
