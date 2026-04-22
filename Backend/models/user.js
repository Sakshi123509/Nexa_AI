import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        unique: true,
        minlength: 6
    },
    history: {
        type: Array,
        default: []
    },
    Ainame: {
        type: String,
        default: "Assistant"
    },
    AIimg: {
        type: String,
        default: ""
    }
}, { timestamps: true });


const User = mongoose.model("myuser", userSchema)
export default User;