import { Pool } from "pg";
import Keys from "./keys";

const connection=new Pool({
	connectionString:Keys.databaseURI
});

module.exports=connection;