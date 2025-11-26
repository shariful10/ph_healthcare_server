export const existingUser = (payload: string, title: string = "User") => {
  const message = `${title} with this email: ${payload} already exists!`;
  return message;
};
