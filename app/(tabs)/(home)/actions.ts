"use server";

import db from "@/lib/db";

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
