import process        from 'process';
import express        from 'express';
import transaction    from './routers/TransactionRouter.js';
import CategoryRouter from './routers/CategoryRouter.js';
import pool           from './database.js';
import UserRouter     from './routers/UserRouter.js';
import auth           from './security/auth.js';

const app = express();

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, async () => {
    console.log(`Server started on port ${server.address().port}`);

    await pool.connect();

    app.use(express.json());
    app.use(express.raw());

    app.use('/api/transactions', transaction);

    const userRouter = new UserRouter(pool);
    app.use('/api/users', userRouter.router);


    const categoryRouter = new CategoryRouter(pool);
    app.use('/api/categories', auth, categoryRouter.router);

    app.use((error, request, response) => {
        console.log(error.stack);
        response.status(500).send(error.message);
    });
});
