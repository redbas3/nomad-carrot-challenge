export default function Loading() {
  return (
    <div className="flex flex-col max-w-[400px] mx-auto pt-14 justify-center gap-5 animate-pulse">
      <div className="h-5 w-20 bg-neutral-700 rounded-md" />
      <div className="flex gap-2 items-center">
        <div className="flex flex-col gap-1">
          <div className="h-5 w-40 bg-neutral-700 rounded-md" />
          <div className="h-5 w-20 bg-neutral-700 rounded-md" />
        </div>
      </div>
      <div className="h-5 w-80 bg-neutral-700 rounded-md" />
    </div>
  );
}
