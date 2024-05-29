"use server";

import db from "@/lib/db";
import userLogin from "@/lib/login";
import { redirect } from "next/navigation";
import { z } from "zod";
import bcrypt from "bcrypt";

const PASSWORD_MIN_LENGTH = 10;
const PASSWORD_REGEX = new RegExp(/^(?=.*\d).+$/);
const PASSWROD_REGEX_ERROR =
  "Password should contain at least one number (0123456789).";

const checkEmail = (email: string) => email.includes("@zod.com");

const formSchema = z.object({
  email: z
    .string()
    .email()
    .toLowerCase()
    .refine(checkEmail, "Only @zod.com emails are allowed"),
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
    password: formData.get("password"),
  };

  const result = await formSchema.safeParseAsync(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    // if the user is found, check password hash
    const user = await db.user.findUnique({
      where: {
        email: result.data.email,
      },
      select: {
        id: true,
        password: true,
      },
    });
    if (!user) {
      return {
        fieldErrors: {
          email: [""],
          password: ["Wrong password"],
        },
      };
    }
    const ok = await bcrypt.compare(
      result.data.password,
      user!.password ?? "xxxx"
    );
    if (ok) {
      // log the user in
      await userLogin(user!.id);
      redirect("/profile");
    } else {
      return {
        fieldErrors: {
          email: [""],
          password: ["Wrong password"],
        },
      };
    }
  }
};
