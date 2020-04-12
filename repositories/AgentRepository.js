class AgentRepository {
    constructor(pool) {
        this._pool = pool;
    }

    async create({ id, name }) {
        const rawCategory = await this._pool.query(
            'INSERT INTO public.agent (name, user_id) VALUES ($1, $2)',
            [`${name.replace(' ', '_')}_${id}`, id],
        );
        console.log(rawCategory);
    }
}

export default AgentRepository;
