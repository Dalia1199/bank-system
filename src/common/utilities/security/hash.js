
import { hashSync, compareSync } from "bcrypt";
import { saltrounds } from "../../../../conflig/confligservice.js";

export function hash({ plain_text, saltround = saltrounds } = {}) {
    if (!plain_text) throw new Error("password is required");
    return hashSync(plain_text, Number(saltround));
}

export function compare({ plain_text, cipher_text } = {}) {
    return compareSync(plain_text, cipher_text);
}