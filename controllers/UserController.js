import bcrypt                from 'bcryptjs';
import jwt                   from 'jsonwebtoken';
import UserRepository        from '../repositories/UserRepository.js';
import AgentRepository       from '../repositories/AgentRepository.js';
import TransactionRepository from '../repositories/TransactionRepository.js';

class UserController {
    constructor(pool) {
        this.getUser = this.getUser.bind(this);
        this.register = this.register.bind(this);
        this.login = this.login.bind(this);
        this.update = this.update.bind(this);
        this.getBalance = this.getBalance.bind(this);
        this.getUserTransactions = this.getUserTransactions.bind(this);
        this.createUserTransactions = this.createUserTransactions.bind(this);

        this.userRepository = new UserRepository(pool);
        this.agentRepository = new AgentRepository(pool);
        this.transactionRepository = new TransactionRepository(pool);
    }

    async getUser(request, response, next) {
        const { id } = request.params;
        const { user } = request;

        if (user !== undefined && user.id === id) {
            const balance = await this.userRepository.getUserBalance(user.id);

            user._balance = balance;
            response.json(user);
        } else {
            next(new Error('Invalid user information'));
        }
    }

    async register(request, response) {
        const { email } = request.body;
        const { password } = request.body;
        const { name } = request.body;

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        const user = await this.userRepository.save({ email, name, password: hash });

        await this.agentRepository.create({ id: user.id, name: user.name });

        user._token = jwt.sign({
            email: user.email,
            name: user.name,
            id: user.id,
        }, hash, {
            expiresIn: '24h',
        });

        response.json(user);
    }

    async login(request, response, next) {
        const { email } = request.body;
        const { password } = request.body;

        const user = await this.userRepository.findByEmail({ email });

        if (bcrypt.compareSync(password, user.password) === true) {
            user._token = jwt.sign({
                email: user.email,
                name: user.name,
                id: user.id,
            }, user.password, {
                expiresIn: '24h',
            });

            response.json(user);
        } else {
            next(new Error('Invalid auth data'));
        }
    }

    async update(request, response, next) {
        const { id } = request.params;
        const { user } = request;
        const { name } = request.body;

        if (user !== undefined && user.id === id) {
            const updatedUser = await this.userRepository.update(user, { name });
            response.json(updatedUser);
        } else {
            next(new Error('Invalid user information'));
        }
    }

    async getBalance(request, response) {
        const userId = request.params.id;

        const balance = await this.userRepository.getUserBalance(userId);

        response.send({ balance });
    }

    async getUserTransactions(request, response, next) {
        const userId = request.params.id;
        const { user } = request;
        const params = request.query !== undefined ? request.query : {};

        if (user !== undefined && user.id === userId) {
            // eslint-disable-next-line max-len
            const transactions = await this.transactionRepository.getTransactionByParams(userId, params);

            response.json(transactions);
        } else {
            next(new Error('Invalid user information'));
        }
    }

    async createUserTransactions(request, response, next) {
        const {
            agentName, count, categoryId, transactionType,
        } = request.body;
        const userId = request.params.id;
        const { user } = request;

        if (user !== undefined && user.id === userId) {
            // eslint-disable-next-line max-len
            const transaction = await this.transactionRepository.createTransaction(user, agentName, count, categoryId, transactionType);

            response.json(transaction);
        } else {
            next(new Error('Invalid user information'));
        }
    }
}

export default UserController;