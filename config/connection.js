import { Pool } from 'pg';
import Keys from './keys';

let connection;
if (process.env.DATABASE_URL) {
	connection = new Pool({ connectionString: process.env.DATABASE_URL });
} else {
	connection = new Pool({ connectionString: Keys.databaseURI });
}

export default connection;
