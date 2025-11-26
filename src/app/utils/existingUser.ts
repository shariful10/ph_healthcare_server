export const existingUser = (email: string, title: string = "User") => {
  const message = `${title} with this email: ${email} already exists!`;
  return message;
};
