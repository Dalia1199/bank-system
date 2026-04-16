
import dotenv from "dotenv";
import { resolve } from "node:path";

const NODE_ENV = process.env.NODE_ENV || "development";

const envpaths = {
    development: ".env.development"
};

dotenv.config({
    path: resolve(`conflig/${envpaths[NODE_ENV]}`)
});

export const PORT = +process.env.port || 3000;
export const secret_key = process.env.secret_key;
export const db_uri = process.env.db_uri;
export const saltrounds = +process.env.saltrounds;
export const refreshsecretkey = process.env.refreshsecretkey;
export const Prefix = process.env.prefix;
export const Email = process.env.Email;
export const password = process.env.password;
// console.log("PORT:", PORT);