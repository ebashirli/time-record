import { hashPassword } from "better-auth/crypto";

async function main() {
  const hashedPassword = await hashPassword("Password123!");
  console.log("Hashed Password:", hashedPassword);
}

main();

// 84443163d619d008902a133cda6c4c51:b4c8ba97eb117771ccc58a331fcf052666fa3ee397be960f9c4c92728c099e486bac796ca28252fcf786388559f0b8ce38f1c63d23d8c5976b0263c9e1c45e31
