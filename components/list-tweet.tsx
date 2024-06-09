"use client";

import { InitialTweets } from "@/app/(tabs)/(home)/page";
import BoxTweet from "./box-tweet";

interface ListTweetProps {
  initialTweets: InitialTweets;
}

export default function ListTweet({ initialTweets }: ListTweetProps) {

  return (
    <div className="p-5 flex flex-col gap-5">
      {initialTweets.map((tweet) => (
        <BoxTweet key={tweet.id} {...tweet} />
      ))}
    </div>
  );
}
