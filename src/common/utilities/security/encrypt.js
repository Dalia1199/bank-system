import crypto from "node:crypto"

const encryption_key = Buffer.from("123456789123456789123456789$#@de")
const IV_LENGTH = 16;
export function encrypt(text) {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv("aes-256-cbc", encryption_key);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex' + ":" + encrypted)

}
export function decrypt(text) {
    const [ivHex, encryptedText] = text.split(":");
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', encryption_key, iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted
}