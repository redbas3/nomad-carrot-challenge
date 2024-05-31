import TweetList from "@/components/tweet-list";
import db from "@/lib/db";
import { PlusIcon } from "@heroicons/react/24/solid";
import { Prisma } from "@prisma/client";
import { unstable_cache as nextCache, revalidatePath } from "next/cache";
import Link from "next/link";

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
      <TweetList initialTweets={initialTweets} />
      <Link
        href="/tweets/add"
        className="bg-orange-500 flex items-center justify-center rounded-full size-16 fixed bottom-24 right-6 text-white transition-colors hover:bg-orange-400"
      >
        <PlusIcon className="size-10" />
      </Link>
    </div>
  );
}
