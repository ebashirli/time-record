// import { hashPassword } from "better-auth/crypto";

async function main() {
  // const hashedPassword = await hashPassword("Password123!");
  // console.log("Hashed Password:", hashedPassword);
  const fileName = 'ZÖHRAB TANRIVERDİYEV.jpg'
  const data  = await fetch(`${process.env.IMAGE_API_URL}/${fileName}`)
  console.log({ data })
}

main();

