"use client";

import { uploadTweet } from "@/app/(tabs)/(home)/actions";
import Input from "./input";
import { TweetType, tweetSchema } from "@/app/(tabs)/(home)/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import FormBtn from "./form-btn";

export default function AddTweet() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<TweetType>({
    resolver: zodResolver(tweetSchema),
  });
  const onSubmit = handleSubmit(async (data: TweetType) => {
    const formData = new FormData();
    formData.append("tweet", data.tweet);
    setValue("tweet", "");
    return uploadTweet(formData);
  });
  const onVaild = async () => {
    await onSubmit();
  };
  return (
    <div>
      <form action={onVaild} className="p-5 flex flex-col gap-5">
        <Input
          placeholder="Tweet"
          type="text"
          {...register("tweet")}
          errors={[errors.tweet?.message ?? ""]}
        />
        <FormBtn text="Tweet" />
      </form>
    </div>
  );
}
