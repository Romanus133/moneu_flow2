import pg from 'pg';

const pool = new pg.Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'money-flow',
    password: 'Ramster13',
    port: 5432,
});

export default pool;
