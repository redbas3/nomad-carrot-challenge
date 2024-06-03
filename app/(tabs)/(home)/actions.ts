"use server";

import db from "@/lib/db";
import { tweetSchema } from "./schema";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";
import { revalidatePath, revalidateTag } from "next/cache";

export async function getMoreTweets(page: number) {
  const tweets = await db.tweet.findMany({
    select: {
      tweet: true,
      created_at: true,
      id: true,
    },
    take: 1,
    skip: page * 1,
    orderBy: {
      created_at: "desc",
    },
  });

  return tweets;
}

export async function uploadTweet(formData: FormData) {
  const data = {
    tweet: formData.get("tweet"),
  };

  const results = tweetSchema.safeParse(data);
  if (!results.success) {
    return results.error.flatten();
  } else {
    const session = await getSession();
    if (session.id) {
      const tweet = await db.tweet.create({
        data: {
          tweet: results.data.tweet,
          user: {
            connect: {
              id: session.id,
            },
          },
        },
      });
      revalidatePath("/");
      redirect(`/`);
    }
  }
}
