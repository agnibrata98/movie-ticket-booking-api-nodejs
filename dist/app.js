"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const db_1 = require("./app/config/db");
const swagger_1 = require("./app/swagger/swagger");
const app = (0, express_1.default)();
const port = process.env.PORT || 8000;
app.use(express_1.default.json());
// Register Swagger
(0, swagger_1.swaggerDocs)(app);
const auth_routes_1 = require("./app/routers/api/auth.routes");
app.use('/api/auth', auth_routes_1.authRouter);
const user_routes_1 = require("./app/routers/api/user.routes");
app.use('/api/user', user_routes_1.userRouter);
const movie_routes_1 = require("./app/routers/api/movie.routes");
app.use('/api/movie', movie_routes_1.movieRouter);
const theatre_routes_1 = require("./app/routers/api/theatre.routes");
app.use('/api/theatre', theatre_routes_1.theatreRouter);
const booking_routes_1 = require("./app/routers/api/booking.routes");
app.use('/api/booking', booking_routes_1.bookingRouter);
db_1.db.then(() => {
    app.listen(port, () => console.log(`Server is listening on port http://localhost:${port}`));
});
