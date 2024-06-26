"use server";

import { PASSWORD_MIN_LENGTH, PASSWORD_REGEX, PASSWROD_REGEX_ERROR } from "@/lib/constants";
import { z } from "zod";
import db from "@/lib/db";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import userLogin from "@/lib/login";

const checkUsername = (username: string) => !username.includes("potato");
const checkPasswords = ({password, confirm_password}: {password: string, confirm_password: string}) => password === confirm_password;
const checkUniqueUsername = async (username: string) => {
  const user = await db.user.findUnique({
    where: {
      username,
    },
    select: {
      id: true,
    },
  });
  return !Boolean(user);
}
const checkUniqueEmail = async (email: string) => {
  const user = await db.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });
  return !Boolean(user);
}

const formSchema = z
.object({
  username: z.string({
    invalid_type_error: "Username must be a string",
    required_error: "Where is my username??"
  })
  .min(3, "Way too short!!!")
  .toLowerCase()
  .trim()
  .transform((data) => data.replace(/\s/g, "-")) // Replace spaces with dashes
  .refine(checkUsername, "No potatoes allowed!"),
  email: z.string().email().toLowerCase(),
  password: z.string().min(PASSWORD_MIN_LENGTH).regex(PASSWORD_REGEX, PASSWROD_REGEX_ERROR),
  confirm_password: z.string().min(10)
})
.superRefine(async ({ username }, ctx) => {
  const user = await db.user.findUnique({
    where: {
      username
    },
    select: {
      id: true,
    },
  });
  if(user) {
    ctx.addIssue({
      code: "custom",
      path: ['username'],
      message: "This username is already taken!",
      fatal: true,
    });

    return z.NEVER;
  }
})
.superRefine(async ({ email }, ctx) => {
  const user = await db.user.findUnique({
    where: {
      email
    },
    select: {
      id: true,
    },
  });
  if(user) {
    ctx.addIssue({
      code: "custom",
      path: ['email'],
      message: "There is an account already registered with this email!",
      fatal: true,
    });

    return z.NEVER;
  }
})
.refine(checkPasswords, {
  message: "Boat paaswords should be ths same!",
  path: ["confirm_password"]
});

export const createAccount = async (prevState: any, formData: FormData) => {
  const data = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirm_password: formData.get("confirm_password"),
  };

  const result = await formSchema.safeParseAsync(data);
  if(!result.success) {
    return result.error.flatten();
  }
  else {
    // hash password
    const hashedPassword = await bcrypt.hash(result.data.password, 12);
    
    // save the user to db
    const user = await db.user.create({
      data: {
        username: result.data.username,
        email: result.data.email,
        password: hashedPassword,
      },
      select: {
        id: true,
      }
    });

    // log the user in
    await userLogin(user.id);

    // redirect to home
    redirect("/profile");
  }
};