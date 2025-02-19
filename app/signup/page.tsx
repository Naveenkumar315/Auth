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
import Link from "next/link";
import React, { useState } from "react";
import axios from "axios";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { signIn } from "next-auth/react";

interface SignupResponse {
  message: string;
  status: number;
}

const SignUp = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);

    try {
      const { data } = await axios.post<SignupResponse>("/api/signup", form, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (data.status === 201) {
        setPending(false);
        toast.success(data.message);
        router.push("/signin");
      } else if (data.status === 400) {
        setError(data.message);
        setPending(false);
      } else if (data.status === 500) {
        setError(data.message);
        setPending(false);
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert(error);
    } finally {
      setPending(false); // Reset pending state
    }
  };

  const handleProvider = (
    event: React.MouseEvent<HTMLButtonElement>,
    value: "google" | "github"
  ) => {
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
            <CardTitle className="text-center">Sign up</CardTitle>
            <CardDescription className="text-sm text-center text-accent-foreground">
              Use email or service, to create account
            </CardDescription>
          </CardHeader>
          {!!error && (
            <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-6">
              <AlertTriangle />
              <p>{error}</p>
            </div>
          )}
          <CardContent className="px-2 sm:px-6">
            <form action="" onSubmit={handleSubmit} className="space-y-3">
              <Input
                type="text"
                disabled={pending}
                placeholder="Full Name"
                value={form.name}
                onChange={(e) => {
                  setForm({ ...form, name: e.target.value });
                }}
              />
              <Input
                type="email"
                disabled={pending}
                placeholder="Email"
                value={form.email}
                onChange={(e) => {
                  setForm({ ...form, email: e.target.value });
                }}
              />
              <Input
                type="password"
                disabled={pending}
                placeholder="password"
                value={form.password}
                onChange={(e) => {
                  setForm({ ...form, password: e.target.value });
                }}
              />
              <Input
                type="password"
                disabled={pending}
                placeholder="confirm password"
                value={form.confirmPassword}
                onChange={(e) => {
                  setForm({ ...form, confirmPassword: e.target.value });
                }}
              />
              <Button className="w-full" size={"lg"} disabled={false}>
                Continue
              </Button>
            </form>
            <Separator />
            <div className="flex my-2 justify-evenly mx-auto items-center">
              <Button
                disabled={pending}
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
              Already have an account?
              <Link
                className="text-sky-700 ml-4 hover:underline cursor-pointer"
                href="signin"
              >
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default SignUp;
