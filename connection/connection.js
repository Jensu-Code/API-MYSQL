import mysq  from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config({ path: './.env.local' });
const config = {
    host: process.env.HOST,
    user: process.env.USER,
    port: process.env.PORTDATABE ,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
}
export class ConnectionDB {
    
    static async connec (){
       try {
          const connection = await mysq.createConnection(config);
          return connection;
       } catch (error) {
         return error.message;
       }
    }

}