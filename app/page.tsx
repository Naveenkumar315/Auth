"use client";
import UserButton from "@/components/user-button";
import { SessionProvider } from "next-auth/react";

const Home = () => {
  return (
    <>
      {/* <div className="h-full flex items-center justify-center"> */}
      <SessionProvider>
        <UserButton />
        <div className="flex items-center justify-center mt-5">
          <h1>Welecome Home</h1>
        </div>
      </SessionProvider>
      {/* </div> */}
    </>
  );
};

export default Home;
