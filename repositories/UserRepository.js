import User from '../models/User.js';

class UserRepository {
    constructor(pool) {
        this._pool = pool;
    }

    async save({ email, name, password }) {
        const rawCategory = await this._pool.query(
            'INSERT INTO public."user" (email, name, password) VALUES ($1, $2, $3) RETURNING *;',
            [email, name, password],
        );

        return new User({
            id: rawCategory.rows[0].id,
            name: rawCategory.rows[0].name,
            email: rawCategory.rows[0].email,
        });
    }

    async findByEmail({ email }) {
        const rawCategory = await this._pool.query(
            'SELECT * FROM public."user" where email=$1;',
            [email],
        );

        const user = new User({
            id: rawCategory.rows[0].id,
            name: rawCategory.rows[0].name,
            email: rawCategory.rows[0].email,
        });
        user._password = rawCategory.rows[0].password;

        return user;
    }

    async findByEmailAndId({ id, email }) {
        const rawCategory = await this._pool.query(
            'SELECT * FROM public."user" where id=$1 AND email=$2;',
            [id, email],
        );

        const user = new User({
            id: rawCategory.rows[0].id,
            name: rawCategory.rows[0].name,
            email: rawCategory.rows[0].email,
        });
        user._password = rawCategory.rows[0].password;

        return user;
    }

    async getUserBalance(userId) {
        const balanceRawData = await this._pool.query('SELECT income, outgoing FROM (SELECT SUM("transaction_incoming".count::money::numeric::float8) FROM (SELECT * FROM public.transaction WHERE (source_agent_id=$1 OR destination_agent_id=$1) AND transaction_type=\'incoming\') as "transaction_incoming") AS "income"(income), (SELECT SUM("transaction_outgoing".count::money::numeric::float8) FROM (SELECT * FROM public.transaction WHERE (source_agent_id=$1 OR destination_agent_id=$1) AND transaction_type=\'outgoing\') as "transaction_outgoing") AS "outgoing"(outgoing);', [userId]);

        return balanceRawData.rows[0].income - balanceRawData.rows[0].outgoing;
    }
}

export default UserRepository;
