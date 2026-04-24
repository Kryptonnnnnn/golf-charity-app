export const generateDrawNumbers = () => {
  return Array.from({ length: 5 }, () =>
    Math.floor(Math.random() * 45) + 1
  );
};