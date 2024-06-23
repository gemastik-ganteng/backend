import { Pool } from "pg";

export const pool = new Pool({
    user: process.env['PG_DATABASE_USER'],
    host: process.env['PG_DATABASE_HOST'],
    database: process.env['PG_DATABASE_NAME'],
    password: process.env['PG_DATABASE_PASSWORD'],
    port: parseInt(process.env['PG_DATABASE_PORT']??'X'), 
  });

const query = async (queryString : string) => {
    const client =  await pool.connect();
    const res = await client.query(queryString);
    client.release()
    return res
 }

 export default query