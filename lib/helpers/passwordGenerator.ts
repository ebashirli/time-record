import crypto from "crypto";
import { hashPassword } from "better-auth/crypto";

export function generatePassword(length = 12) {
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const symbols = "!@#$%&";

  const allChars = uppercase + lowercase + numbers + symbols;
  let password = "";

  // Ensure at least one character from each set is included
  password += uppercase[crypto.randomInt(0, uppercase.length)];
  password += lowercase[crypto.randomInt(0, lowercase.length)];
  password += numbers[crypto.randomInt(0, numbers.length)];
  password += symbols[crypto.randomInt(0, symbols.length)];

  // Fill the rest of the password length randomly
  for (let i = password.length; i < length; i++) {
    const randomIndex = crypto.randomInt(0, allChars.length);
    password += allChars[randomIndex];
  }

  // Shuffle the string so the guaranteed characters aren't always at the start
  return password
    .split("")
    .sort(() => crypto.randomInt(-1, 2))
    .join("");
}

const password = generatePassword(8);
console.log({
  hashedPassword: await hashPassword(password),
});
