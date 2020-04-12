import express        from 'express';
import UserController from '../controllers/UserController.js';

class UserRouter {
    constructor(pool) {
        this._router = express.Router();
        this._userController = new UserController(pool);

        this._router.route('/:id/balance').get(this._userController.getBalance);
        this._router.route('/register').post(this._userController.register);
        this._router.route('/login').post(this._userController.login);
        this._router.route('/:id').put(this._userController.update);
        this._router.route('/:id').delete(this._userController.delete);
    }

    get router() {
        return this._router;
    }
}

export default UserRouter;
