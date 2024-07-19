import generatePassword from "generate-password";

export const passwordGenerator = (count) => {
  return generatePassword.generateMultiple(count, {
    length: 12,
    numbers: true,
    symbols: true,
    uppercase: true,
    lowercase: true,
    exclude: "'\"`$%^*()-_=+[{]}\\|;:,.<>/",
  });
};
<<<<<<< HEAD

// console.log(passwordGenerator(3));
=======
>>>>>>> e3adac854def73ef712a0b9d22f389d4501fa634
