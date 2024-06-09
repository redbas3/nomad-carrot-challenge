"use client";

import { InitialResponses } from "@/app/tweets/[id]/page";
import BoxResponse from "./box-response";
import { useOptimistic } from "react";
import AddResponse from "./add_response";

interface ListResponseProps {
  initialResponses: InitialResponses;
  tweetId: number;
}[];

export default function ListResponse({ initialResponses, tweetId }: ListResponseProps) {
  const [state, reducerFn] = useOptimistic({ initialResponses }, (previousState, payload) => ({
    initialResponses: [payload, ...previousState.initialResponses]
  }));

  return (<div>
    <AddResponse tweetId={tweetId} reducerFn={reducerFn} />
    <ul className="flex flex-col gap-5 py-3">
      {state.initialResponses.map((response) => (
        <li key={response.id}>
          <BoxResponse {...response} />
        </li>
      ))}
    </ul>
  </div>
  );
}
