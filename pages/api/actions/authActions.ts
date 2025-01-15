//api/actions/authActions.ts
import { auth, signIn, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { LoginSchemaType } from "@/lib/schemas/LoginSchema";
import {
  registerSchema,
  RegisterSchemaType,
} from "@/lib/schemas/RegisterSchema";
import { ActionResult } from "@/types";
import { User } from "@prisma/client";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function signInUser(
  data: LoginSchemaType
): Promise<ActionResult<string>> {
  try {
    const existingUser = await getUserByEmail(data.email);

    if (!existingUser || !existingUser.email)
      return { status: "error", error: "Invalid credentials" };

    if (!existingUser.emailVerified) {
      //const { token, email } = await generateToken(existingUser.email, TokenType.VERIFICATION);

      //await sendVerificationEmail(email, token)

      return {
        status: "error",
        error: "Please verify your email before logging in",
      };
    }

    await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    return { status: "success", data: "Logged in" };
  } catch (error) {
    console.log(error);
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { status: "error", error: "Invalid credentials" };
        default:
          return { status: "error", error: "Something went wrong" };
      }
    } else {
      return { status: "error", error: "Something else went wrong" };
    }
  }
}
