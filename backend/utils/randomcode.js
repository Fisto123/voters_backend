import randomstring from "randomstring";

export const generateCode = () => {
  let number = randomstring.generate({
    length: 6,
    charset: "numeric",
  });
  return number;
};

export const generate8DigitCode = () => {
  let number = randomstring.generate({
    length: 8,
    charset: "numeric",
  });
  return number;
};
