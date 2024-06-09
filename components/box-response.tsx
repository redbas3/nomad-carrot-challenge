import { formatToTimeAgo } from "@/lib/utils";
import Link from "next/link";

interface BoxResponseProps {
  id: number;
  payload: string;
  created_at: Date;
  user: {
    username: string;
  }
}

export default function BoxResponse({ id, payload, created_at, user: { username } }: BoxResponseProps) {
  return (
    <Link href={`/post/${id}`} className="flex gap-5">
      <div className="flex flex-col gap-1">
        <span className="text-md text-neutral-600">{username}</span>
        <span className="text-sm text-neutral-500">
          {formatToTimeAgo(created_at.toString())}
        </span>
        <span className="text-lg">{payload}</span>
      </div>
    </Link>
  );
}
