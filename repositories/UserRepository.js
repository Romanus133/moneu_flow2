import User from '../models/User.js';

class UserRepository {
    constructor(pool) {
        this._pool = pool;
    }

    async save({ email, name, password }) {
        const userRawData = await this._pool.query(
            'INSERT INTO public."user" (email, name, password) VALUES ($1, $2, $3) RETURNING *;',
            [email, name, password],
        );

        return new User({
            id: userRawData.rows[0].id,
            name: userRawData.rows[0].name,
            email: userRawData.rows[0].email,
        });
    }

    async findByEmail({ email }) {
        const userRawData = await this._pool.query(
            'SELECT * FROM public."user" where email=$1;',
            [email],
        );

        const user = new User({
            id: userRawData.rows[0].id,
            name: userRawData.rows[0].name,
            email: userRawData.rows[0].email,
        });
        user._password = userRawData.rows[0].password;

        return user;
    }

    async findByEmailAndId({ id, email }) {
        const userRawData = await this._pool.query(
            'SELECT * FROM public."user" where id=$1 AND email=$2;',
            [id, email],
        );

        const user = new User({
            id: userRawData.rows[0].id,
            name: userRawData.rows[0].name,
            email: userRawData.rows[0].email,
        });
        user._password = userRawData.rows[0].password;

        return user;
    }

    async getUserBalance(userId) {
        const rawAgentId = await this._pool.query('SELECT id FROM public.agent WHERE user_id=$1;', [userId]);

        const balanceRawData = await this._pool.query('SELECT income, outgoing FROM (SELECT SUM("transaction_incoming".count::money::numeric::float8) FROM (SELECT * FROM public.transaction WHERE (source_agent_id=$1 OR destination_agent_id=$1) AND transaction_type=\'incoming\') as "transaction_incoming") AS "income"(income), (SELECT SUM("transaction_outgoing".count::money::numeric::float8) FROM (SELECT * FROM public.transaction WHERE (source_agent_id=$1 OR destination_agent_id=$1) AND transaction_type=\'outgoing\') as "transaction_outgoing") AS "outgoing"(outgoing);', [rawAgentId.rows[0].id]);

        return balanceRawData.rows[0].income - balanceRawData.rows[0].outgoing;
    }

    async update(user, { name }) {
        const userRawData = await this._pool.query('UPDATE public."user" SET name=$2 WHERE id=$1 RETURNING *;', [user.id, name]);

        return new User({
            id: userRawData.rows[0].id,
            name: userRawData.rows[0].name,
            email: userRawData.rows[0].email,
        });
    }
}

export default UserRepository;