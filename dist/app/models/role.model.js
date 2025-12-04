"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleModel = exports.RoleSchemaValidate = void 0;
const mongoose_1 = require("mongoose");
const joi_1 = __importDefault(require("joi"));
//validation schema
exports.RoleSchemaValidate = joi_1.default.object({
    name: joi_1.default.string().required().min(3),
});
const RoleSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
}, { timestamps: true });
const RoleModel = (0, mongoose_1.model)("Role", RoleSchema);
exports.RoleModel = RoleModel;
