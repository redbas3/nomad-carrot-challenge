"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { revalidatePath, revalidateTag } from "next/cache";
import { responseSchema } from "./schema";
import { redirect } from "next/navigation";

export async function uploadResponse(formData: FormData) {
  const data = {
    payload: formData.get("payload"),
    tweetId: formData.get("tweetId")
  };

  const results = responseSchema.safeParse(data);
  if (!results.success) {
    return results.error.flatten();
  } else {
    const session = await getSession();
    if (session.id) {
      await db.response.create({
        data: {
          payload: results.data.payload,
          tweetId: parseInt(results.data.tweetId),
          userId: session.id,
        }
      });
      revalidatePath(`/tweets/${results.data.tweetId}`);
      redirect(`/tweets/${results.data.tweetId}`);
    }
  }
}

export const likePost = async (tweetId: number) => {
  "use server";
  try {
    const session = await getSession();
    if (session.id === undefined) {
      return;
    }
    const post = await db.like.create({
      data: {
        tweetId,
        userId: session.id,
      },
    });

    revalidateTag(`like-status-${tweetId}`);
  } catch (e) {

  }
}

export const dislikePost = async (tweetId: number) => {
  "use server";
  try {
    const session = await getSession();
    if (session.id === undefined) {
      return;
    }
    const post = await db.like.delete({
      where: {
        id: {
          tweetId,
          userId: session.id,
        }
      },
    });

    revalidateTag(`like-status-${tweetId}`);
  } catch (e) {
  }
}