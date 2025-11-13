import express from 'express';
import homeRoutes from "@/modules/app/";
import { errorHandler } from "@/lib/errorHandler";
import { router as userRoutes } from "@/modules/users/index";
import { router as authRouter } from "@/modules/auth/index";
import { router as bookRouter } from "@/modules/books/index";

const app = express();

app.use(express.json());
app.use('/home',  homeRoutes);
app.use('/users', userRoutes);
app.use('/auth',  authRouter);
app.use('/books', bookRouter);
app.use(errorHandler);

export default app;