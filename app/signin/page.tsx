"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardDescription,
  CardContent,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
// import axios from "axios";
import { AlertTriangle } from "lucide-react";
// import { redirect } from "next/dist/server/api-utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
// import { userAgent } from "next/server";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";

const SignIn = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const handleSubmit = async (e: React.FormEvent) => {
    debugger;
    e.preventDefault();
    setPending(true);
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.ok) {
      router.push("/");
      toast.success("login successful");
    } else if (res?.status === 401) {
      setError("Invalid Credentials");
      setPending(false);
    } else {
      setError("Something went wrong");
    }
  };

  const handleProvider = (
    event: React.MouseEvent<HTMLButtonElement>,
    value: "google" | "github"
  ) => {
    debugger;
    event.preventDefault();
    signIn(value, {
      callbackUrl: "/",
    });
  };

  return (
    <>
      <div className="h-full flex items-center justify-center bg-[#1b0918]">
        <Card className="md:h-auto w-[80%] sm:w-[420px] p-4 sm:p-8">
          <CardHeader>
            <CardTitle className="text-center">Sign in</CardTitle>
            <CardDescription className="text-sm text-center text-accent-foreground">
              Use email or service, to sign in
            </CardDescription>
          </CardHeader>
          {!!error && (
            <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-6">
              <AlertTriangle />
              <p>{error}</p>
            </div>
          )}
          <CardContent className="px-2 sm:px-6">
            <form onSubmit={handleSubmit} action="" className="space-y-3">
              <Input
                type="email"
                disabled={pending}
                placeholder="Email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
              <Input
                type="password"
                disabled={pending}
                placeholder="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
              <Button className="w-full" size={"lg"} disabled={pending}>
                Continue
              </Button>
            </form>
            <Separator />
            <div className="flex my-2 justify-evenly mx-auto items-center">
              <Button
                disabled={false}
                onClick={(e) => {
                  handleProvider(e, "google");
                }}
                variant="outline"
                size={"lg"}
                className="bg-slate-300 hover:bg-slate-400 hover:scale-110"
              >
                <FcGoogle className="size-8 lef-2.5 topp-2.5" />
              </Button>
              <Button
                disabled={false}
                onClick={(e) => {
                  handleProvider(e, "github");
                }}
                variant="outline"
                size={"lg"}
                className="bg-slate-300 hover:bg-slate-400 hover:scale-110"
              >
                <FaGithub className="size-8 lef-2.5 topp-2.5" />
              </Button>
            </div>
            <p className="text-center text-sm mt-2 text-muted-foreground">
              Create new account
              <Link
                className="text-sky-700 ml-4 hover:underline cursor-pointer"
                href="/signup"
              >
                Sign up
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default SignIn;
