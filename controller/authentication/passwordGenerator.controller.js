import generatePassword from "generate-password";

export const passwordGenerator = (count) => {
    return generatePassword.generateMultiple(count, {
        length: 12,
        numbers: true,
        symbols: true,
        uppercase: true,
        lowercase: true,
        exclude: "'\"`$%^*()-_=+[{]}\\|;:,.<>/"
    })
};
