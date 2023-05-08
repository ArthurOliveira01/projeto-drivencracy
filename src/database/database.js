import dotenv from "dotenv";
import { MongoClient } from "mongodb";

dotenv.config();

const port = process.env.DATABASE_URL;

const client = new MongoClient(port);

client.connect().then(() => {
    console.log(`Conectou na porta ${port}`);
}).catch((e) =>{
    console.log(e);
})

export const db = client.db();