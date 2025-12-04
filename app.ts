import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { db } from './app/config/db';
import { swaggerDocs } from './app/swagger/swagger';


const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
// Register Swagger
swaggerDocs(app);

import { authRouter } from './app/routers/api/auth.routes';
app.use('/api/auth', authRouter);

import { userRouter } from './app/routers/api/user.routes';
app.use('/api/user', userRouter);

import { movieRouter } from './app/routers/api/movie.routes';
app.use('/api/movie', movieRouter);

import { theatreRouter } from './app/routers/api/theatre.routes';
app.use('/api/theatre', theatreRouter);

import { bookingRouter } from './app/routers/api/booking.routes';
app.use('/api/booking', bookingRouter);

db.then(() => {
    app.listen(port, () => console.log(`Server is listening on port ${port}`))
});