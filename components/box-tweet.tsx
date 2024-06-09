import { formatToTimeAgo } from "@/lib/utils";
import Link from "next/link";

interface BoxTweetProps {
  tweet: string;
  created_at: Date;
  id: number;
}

export default function BoxTweet({ tweet, created_at, id }: BoxTweetProps) {
  return (
    <Link href={`/tweets/${id}`} className="flex gap-5">
      <div className="flex flex-col gap-1">
        <span className="text-lg">{tweet}</span>
        <span className="text-sm text-neutral-500">
          {formatToTimeAgo(created_at.toString())}
        </span>
      </div>
    </Link>
  );
}
