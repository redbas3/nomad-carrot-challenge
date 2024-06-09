import AddTweet from "@/components/add-tweet";
import ListTweet from "@/components/list-tweet";
import db from "@/lib/db";
import { Prisma } from "@prisma/client";
import { unstable_cache as nextCache, revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

const getCashedTweets = nextCache(getInitialTweets, ["home-tweets"]);

async function getInitialTweets() {
  const tweets = await db.tweet.findMany({
    select: {
      tweet: true,
      created_at: true,
      id: true,
    },
    // take: 1,
    orderBy: {
      created_at: "desc",
    },
  });

  return tweets;
}

export type InitialTweets = Prisma.PromiseReturnType<typeof getInitialTweets>;

export const revalidate = 60;

export default async function Tweets() {
  const initialTweets = await getCashedTweets();
  const revalidate = async () => {
    "use server";
    revalidatePath("/home");
  };
  return (
    <div className="flex flex-col max-w-[400px] mx-auto pt-14 justify-center gap-5">
      <AddTweet />
      <ListTweet initialTweets={initialTweets} />
    </div>
  );
}
