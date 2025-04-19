import pg from "pg";
const { Client } = pg;

const client = new Client ({
    user: 'postgres',
    host: 'localhost', 
    database: 'cookmate',
    password: 'riverside',
    port: 5432,
});

await client.connect();
export { client };