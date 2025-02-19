import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Loader } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import Link from "next/link";

const UserButton = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <Loader className="size-6 mr-4 mt-4 float-right animate-spin" />;
  }
  const avatarFallback = session?.user?.name?.charAt(0).toUpperCase();

  const handleSignOut = async () => {
    await signOut({
      redirect: false,
    });
    router.push("/");
  };

  return (
    <>
      <nav>
        {session ? (
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger className="outline-none relative float-right p-4 md:p-8">
              <div className="flex gap-4 items-center">
                <span className="">{session.user?.name}</span>
                <span>
                  <Avatar className="size-10 hover:opacity-75 transition">
                    <AvatarImage
                      className="size-10 hover:opacity-75 transition "
                      src={session?.user?.image || undefined}
                    />
                    <AvatarFallback className="bg-sky-900 text-white p-2 rounded">
                      {avatarFallback}
                    </AvatarFallback>
                  </Avatar>
                </span>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="center"
              side="bottom"
              className="rounded-md shadow-lg bg-white border border-gray-200"
            >
              <DropdownMenuItem
                onClick={handleSignOut}
                className="cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:bg-gray-100"
              >
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex justify-end p-4 gap-4">
            <Button>
              <Link href="/signin">Sign in</Link>
            </Button>
            <Button>
              <Link href="/signup">Sign up</Link>
            </Button>
          </div>
        )}
      </nav>
    </>
  );
};

export default UserButton;
