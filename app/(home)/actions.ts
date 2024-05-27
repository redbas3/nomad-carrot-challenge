"use server";

import { z } from "zod";

const PASSWORD_MIN_LENGTH = 10;
const PASSWORD_REGEX = new RegExp(
  /^(?=.*\d).+$/
);
const PASSWROD_REGEX_ERROR = "Password should contain at least one number (0123456789).";

const checkEmail = (username: string) => username.includes("@zod.com");

const formSchema = z.object({
  email: z
    .string()
    .email()
    .toLowerCase()
    .refine(checkEmail, "Only @zod.com emails are allowed"),
  username: z.string()
    .min(5, "Username should be at least 5 characters long."),
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(PASSWORD_MIN_LENGTH, "Password should be at least 10 characters long.")
    .regex(PASSWORD_REGEX, PASSWROD_REGEX_ERROR),
});

export const login = async (prevState: any, formData: FormData) => {
  const data = {
    email: formData.get("email"),
    username: formData.get("username"),
    password: formData.get("password"),
  };

  const result = await formSchema.safeParseAsync(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    return {
      fieldErrors: {
        email: null,
        username: null,
        password: null,
      },
    };
  }
};
