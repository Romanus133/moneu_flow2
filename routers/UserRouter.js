import express        from 'express';
import UserController from '../controllers/UserController.js';
import auth from '../security/auth.js';

class UserRouter {
    constructor(pool) {
        this._router = express.Router();
        this._userController = new UserController(pool);

        this._router.use('/:id', auth);
        this._router.route('/:id').get(this._userController.getUser);
        this._router.route('/:id').put(this._userController.update);

        this._router.use('/:id/balance', auth);
        this._router.route('/:id/balance').get(this._userController.getBalance);

        this._router.use('/:id/transactions', auth);
        this._router.route('/:id/transactions').get(this._userController.getUserTransactions);
        this._router.route('/:id/transactions').post(this._userController.createUserTransactions);

        this._router.route('/register').post(this._userController.register);
        this._router.route('/login').post(this._userController.login);
    }

    get router() {
        return this._router;
    }
}

export default UserRouter;