import db from "@/lib/db";
import getSession from "@/lib/session";
import { EyeIcon } from "@heroicons/react/24/solid";
import { notFound } from "next/navigation";
import { unstable_cache as nextCache, revalidateTag } from "next/cache";
import { formatToTimeAgo } from "@/lib/utils";
import Link from "next/link";

async function getTweet(id: number) {
  await new Promise(resolve => setTimeout(resolve, 10000));

  try {
    const tweet = await db.tweet.update({
      where: {
        id,
      },
      data: {
        views: {
          increment: 1,
        },
      },
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
    });

    return tweet;
  } catch (e) {
    return null;
  }
}

const getCachedTweet = nextCache(getTweet, ["tweet-detail"], {
  tags: ["tweet-detail"],
  revalidate: 60,
});

export default async function TweetDetail({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return notFound();
  }
  const tweet = await getCachedTweet(id);
  if (!tweet) {
    return notFound();
  }

  return (
    <div className="flex flex-col max-w-[400px] mx-auto pt-14 justify-center gap-5">
      <Link href="/" className="text-blue-500">
        {" "}
        &larr; Back
      </Link>
      <div className="flex items-center gap-2 mb-2">
        <div>
          <span className="text-sm font-semibold">{tweet.user.username}</span>
          <div className="text-xs">
            <span>{formatToTimeAgo(tweet.created_at.toString())}</span>
          </div>
        </div>
      </div>
      <p className="mb-5">{tweet.tweet}</p>
      <div className="flex flex-col gap-5 items-start">
        <div className="flex items-center gap-2 text-neutral-400 text-sm">
          <EyeIcon className="size-5" />
          <span>조회 {tweet.views}</span>
        </div>
      </div>
    </div>
  );
}
