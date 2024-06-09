"use client";

import { InitialTweets } from "@/app/(tabs)/(home)/page";
import ListTweet from "./list-tweet";

interface TweetListProps {
  initialTweets: InitialTweets;
}

export default function TweetList({ initialTweets }: TweetListProps) {

  return (
    <div className="p-5 flex flex-col gap-5">
      {initialTweets.map((tweet) => (
        <ListTweet key={tweet.id} {...tweet} />
      ))}
    </div>
  );
}
