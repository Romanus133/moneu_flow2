import jwt            from 'jsonwebtoken';
import UserRepository from '../repositories/UserRepository.js';
import pool           from '../database.js';

const userRepository = new UserRepository(pool);

async function checkUser(request, response, next) {
    if (request.headers.authorization !== undefined) {
        const token = request.headers.authorization.split(' ')[1];

        const decoded = await jwt.decode(token);

        const user = await userRepository.findByEmailAndId({
            id: decoded.id,
            email: decoded.email,
        });

        if (user !== null && await jwt.verify(token, user.password) !== null) {
            request.user = user;
            request.user.role = 'Admin';

            next();
        } else {
            next(new Error('Invalid auth data'));
        }
    } else {
        next(new Error('Invalid auth data'));
    }
}

export default checkUser;
