"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
//importing modules
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
dotenv_1.default.config();
//details from the env
const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const dbName = 'movie_booking_application';
//connection string to mongo atlas
const connectionString = process.env.DB_URI;
if (!connectionString) {
    throw new Error('DB_URI environment variable is not defined');
}
//db connection
exports.db = mongoose_1.default.connect(connectionString)
    .then(res => {
    if (res) {
        console.log(`Database connection succeffully to ${dbName}`);
    }
}).catch(err => {
    console.log(err);
});
