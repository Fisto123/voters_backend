import randomstring from "randomstring";

export const generateCode = () => {
  let number = randomstring.generate({
    length: 6,
    charset: "numeric",
  });
  return number;
};
