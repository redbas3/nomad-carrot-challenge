import { ForwardedRef, InputHTMLAttributes, forwardRef } from "react";

interface InputProps {
  errors?: string[];
  name: string; // name을 잊는 것을 방지 하기 위해 남겨둠, 필수항목을 표시하는 것처럼
}

const _Input = (
  {
    errors = [],
    name,
    ...rest
  }: InputProps & InputHTMLAttributes<HTMLInputElement>,
  ref: ForwardedRef<HTMLInputElement>
) => {
  return (
    <div className="flex flex-col gap-2">
      <input
        ref={ref}
        name={name}
        className="bg-transparent rounded-md w-full h-10 focus:outline-none ring-2 focus:ring-4 ring-neutral-200 focus:ring-orange-500 border-none placeholder:text-neutral-500 transition px-2"
        {...rest}
      />
      {errors?.map((error, index) => (
        <span key={index} className="text-red-800 font-medium">
          {error}
        </span>
      ))}
    </div>
  );
};

export default forwardRef(_Input);
