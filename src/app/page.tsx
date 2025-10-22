import { auth } from "@/server/auth";
import { api } from "@/trpc/server";
import Sidebar from "@/components/sidebar";

export default async function Home() {
  const hello = await api.post.hello({ text: "from tRPC" });
  const session = await auth();

  if (session?.user) {
    void api.post.getLatest.prefetch();
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
    </div>
  );
}
