import bcryptjs from "bcryptjs";

export const generateHashPassword = async (password: string): Promise<string> => {
  try {
    const hashedPassword = await bcryptjs.hash(password, 10);
    return hashedPassword;
  } catch (error) {
    throw new Error("error in hashing password");
  }
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  try {
    return bcryptjs.compare(password, hashedPassword);
  } catch (error) {
    throw new Error("error in comparing hash password");
  }
};
