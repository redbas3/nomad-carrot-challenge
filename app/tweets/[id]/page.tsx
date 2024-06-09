import db from "@/lib/db";
import getSession from "@/lib/session";
import { EyeIcon } from "@heroicons/react/24/solid";
import { notFound } from "next/navigation";
import { unstable_cache as nextCache, revalidateTag } from "next/cache";
import { formatToTimeAgo } from "@/lib/utils";
import Link from "next/link";
import LikeButton from "@/components/like-button";
import { Prisma } from "@prisma/client";
import AddResponse from "@/components/add_response";
import ListResponse from "@/components/list-response";

async function getTweet(id: number) {
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

async function getLikeStatus(tweetId: number) {
  try {
    const session = await getSession();
    if (session.id === undefined) {
      return {
        likeCount: 0,
        isLiked: false,
      }
    }
    const isLiked = await db.like.findUnique({
      where: {
        id: {
          tweetId,
          userId: session.id,
        }
      },
    });

    const likeCount = await db.like.count({
      where: {
        tweetId,
      }
    });

    return {
      likeCount,
      isLiked: Boolean(isLiked),
    };
  } catch (e) {
    return {
      likeCount: 0,
      isLiked: false,
    }
  }
}

async function getResponses(tweetId: number) {
  try {
    const responses = await db.response.findMany({
      where: {
        tweetId
      },
      select: {
        id: true,
        payload: true,
        created_at: true,
        user: {
          select: {
            username: true,
          }
        }
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return responses;
  } catch (e) {
    return [];
  }
}

export type InitialResponses = Prisma.PromiseReturnType<typeof getResponses>;


// function getCachedLikeStatus(tweetId: number) {
//   const cachedOperation = nextCache(getLikeStatus, ["post-like-status"], {
//     tags: [`like-status-${tweetId}`],
//   });
//   return cachedOperation(tweetId);
// }

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

  const { likeCount, isLiked } = await getLikeStatus(id);
  const responses = await getResponses(id);

  return (
    <div className="flex flex-col max-w-[400px] mx-auto pt-14 justify-center gap-5">
      <Link href="/" className="text-blue-500">
        {" "}
        &larr; Back
      </Link>
      <div className="flex items-center gap-2">
        <div>
          <span className="text-sm font-semibold">{tweet.user.username}</span>
          <div className="text-xs py-1">
            <span>{formatToTimeAgo(tweet.created_at.toString())}</span>
          </div>
          <div className="flex items-center gap-2 text-neutral-400 text-sm">
            <EyeIcon className="size-5" />
            <span>조회 {tweet.views}</span>
          </div>
        </div>
      </div>
      <p>{tweet.tweet}</p>
      <div className="flex flex-col gap-5 items-start">
        <LikeButton likeCount={likeCount} isLiked={isLiked} tweetId={id} />
      </div>
      <hr className="my-2" />
      <ListResponse initialResponses={responses} tweetId={id} />
    </div>
  );
}
