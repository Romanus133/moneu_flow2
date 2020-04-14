class TransactionRepository {
    constructor(pool) {
        this._pool = pool;
    }

    async createTransaction(user, agentName, count, categoryId, transactionType) {
        let sourceRawAgentId = await this._pool.query('SELECT id FROM public.agent WHERE user_id=$1;', [user.id]);

        let destinationAgentId;
        destinationAgentId = await this._pool.query('SELECT id FROM public.agent WHERE name=$1;', [agentName]);
        if (destinationAgentId.rows.length === 0) {
            destinationAgentId = await this._pool.query(
                'INSERT INTO public.agent (name) VALUES ($1) RETURNING *;',
                [agentName],
            );
        }

        sourceRawAgentId = sourceRawAgentId.rows[0].id;
        destinationAgentId = destinationAgentId.rows[0].id;

        const createdRawTransaction = await this._pool.query('INSERT INTO public.transaction (source_agent_id, destination_agent_id, count, category_id, transaction_type) VALUES ($1, $2, $3, $4, $5) RETURNING *', [
            sourceRawAgentId,
            destinationAgentId,
            count,
            categoryId,
            transactionType,
        ]);

        const rawTransaction = await this._pool.query('SELECT tr.id, s.name as source_agent_name, d.name as destination_agent_name, tr.count, tr.date, tr.transaction_type, c.name as category_name FROM public.transaction tr inner join agent s on tr.source_agent_id = s.id inner join agent d on tr.destination_agent_id = d.id inner join category c on tr.category_id = c.id WHERE tr.id=$1;', [createdRawTransaction.rows[0].id]);

        return rawTransaction.rows[0];
    }

    async getTransactionByParams(userId, params) {
        const rawAgentId = await this._pool.query('SELECT id FROM public.agent WHERE user_id=$1;', [userId]);
        const agentId = rawAgentId.rows[0].id;

        let query = 'SELECT tr.id, s.name as source_agent_name, d.name as destination_agent_name, tr.count, tr.date, tr.transaction_type, c.name as category_name FROM public.transaction tr inner join agent s on tr.source_agent_id = s.id inner join agent d on tr.destination_agent_id = d.id inner join category c on tr.category_id = c.id WHERE (source_agent_id=$1 OR destination_agent_id=$1)';
        const queryParam = [agentId];

        if (params.date !== undefined) {
            queryParam.push(params.date);
            query = `${query} AND date=$${queryParam.length}`;
        } else {
            // eslint-disable-next-line no-param-reassign
            params.date = {};
        }

        if (params.limit !== undefined) {
            queryParam.push(Number(params.limit));
            query = `${query} LIMIT $${queryParam.length}`;
        } else {
            // eslint-disable-next-line no-param-reassign
            params.limit = {};
        }

        if (params.offset !== undefined) {
            queryParam.push(Number(params.offset));
            query = `${query} OFFSET $${queryParam.length}`;
        } else {
            // eslint-disable-next-line no-param-reassign
            params.offset = {};
        }

        // eslint-disable-next-line max-len
        const rawTransactions = await this._pool.query(query, queryParam);

        return rawTransactions.rows;
    }
}
}
export default TransactionRepository;