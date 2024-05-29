import getSession from "@/lib/session";
import { notFound, redirect } from "next/navigation";
import db from "@/lib/db";
import { Suspense } from "react";
import FormBtn from "@/components/form-btn";

async function getUser() {
  const session = await getSession();
  if (session.id) {
    const user = await db.user.findUnique({
      where: {
        id: session.id,
      },
      select: {
        id: true,
        username: true,
        email: true,
      },
    });
    if (user) {
      return user;
    }
  }
  notFound();
}

async function Username() {
  const user = await getUser();
  return <h1>{user?.username}</h1>;
}

export default async function Profile() {
  const logOut = async () => {
    "use server";

    const session = await getSession();
    await session.destroy();
    redirect("/");
  };
  return (
    <div className="flex flex-col max-w-[400px] mx-auto pt-14 justify-center gap-5">
      <Suspense fallback={<h1>Weolcome!</h1>}>
        <Username />
      </Suspense>
      <form action={logOut}>
        <FormBtn text="Log out" />
      </form>
    </div>
  );
}
