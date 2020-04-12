import bcrypt          from 'bcryptjs';
import jwt             from 'jsonwebtoken';
import UserRepository  from '../repositories/UserRepository.js';
import AgentRepository from '../repositories/AgentRepository.js';

class UserController {
    constructor(pool) {
        this.get = this.get.bind(this);
        this.register = this.register.bind(this);
        this.login = this.login.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.getBalance = this.getBalance.bind(this);

        this.userRepository = new UserRepository(pool);
        this.agentRepository = new AgentRepository(pool);
    }

    async get(request, response) {
        response.send('Get user');
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

    async update(request, response) {
        response.send('Update user');
    }

    async delete(request, response) {
        response.send('Delete user');
    }

    async getBalance(request, response) {
        const userId = request.params.id;

        const balance = await this.userRepository.getUserBalance(userId);

        response.send({ balance });
    }
}

export default UserController;
