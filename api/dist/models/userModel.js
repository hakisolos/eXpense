"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const Userschema = new mongoose_1.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});
exports.User = (0, mongoose_1.model)("User", Userschema);
