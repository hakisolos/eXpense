"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const connb = async () => {
    console.log('connecting database');
    try {
        await mongoose_1.default.connect(String(process.env.CSTRING));
    }
    catch (e) {
        console.log(e);
    }
};
exports.default = connb;
