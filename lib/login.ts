import getSession from "@/lib/session";

export default async function userLogin(id: number) {
  const session = await getSession();
  session.id = id;
  await session.save();
}