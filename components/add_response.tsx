"use client";

import Input from "./input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import FormBtn from "./form-btn";
import { ResponseType, responseSchemaForFront } from "@/app/tweets/[id]/schema";
import { uploadResponse } from "@/app/tweets/[id]/actions";

export default function AddResponse({ tweetId, reducerFn }: { tweetId: number, reducerFn: Function }) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ResponseType>({
    resolver: zodResolver(responseSchemaForFront),
  });
  const onSubmit = handleSubmit(async (data: ResponseType) => {
    const formData = new FormData();
    formData.append("payload", data.payload);
    formData.append("tweetId", tweetId + "");
    setValue("payload", "");

    reducerFn({ tweetId: tweetId, payload: data.payload, created_at: new Date(), user: { username: 'username...' } })

    return uploadResponse(formData);
  });
  const onVaild = async () => {
    await onSubmit();
  };
  return (
    <div>
      <form action={onVaild} className="flex flex-col gap-5">
        <Input
          placeholder="Response"
          type="text"
          {...register("payload")}
          errors={[errors.payload?.message ?? ""]}
        />
        <FormBtn text="Response" />
      </form>
    </div>
  );
}
