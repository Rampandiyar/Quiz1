import mongoose, {  model, Schema } from "mongoose";

const RoleSchema = new Schema({
    role:{
        type: String,
        required: true
    }
},
{
    versionKey:false,
});

export default model('Role',RoleSchema);