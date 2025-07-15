"use client";

import Link from "next/link";
import { FormEvent, useActionState, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CircleIcon, Eye, EyeOff, Loader2 } from "lucide-react";
import { logIn, logInSchema } from "./clientAction";
import useSWR from "swr";
import { fetcher, logActivityy, validatedAction } from "@/lib/auth/actions";
import { ActivityType } from "@/lib/db/schema";
import { httpRequest } from "@/lib/http";
import apiRoutes from "@/lib/apiRoutes";

export function Login({ mode = "signin" }: { mode?: "signin" | "signup" }) {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const priceId = searchParams.get("priceId");
  const inviteId = searchParams.get("inviteId");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const { data } = useSWR("/api/users", fetcher);
  console.log(data, "user data");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordToggled, setPasswordToggled] = useState(false);

  const handleLogin = validatedAction(logInSchema, async (data, _) => {
    setError("");
    setPending(true);

    try {
      const res = await httpRequest(apiRoutes.login, {
        body: data,
      });

      setPending(false);
      await logActivityy(res.user.id ?? "", ActivityType.SIGN_IN);
      localStorage.setItem("user", JSON.stringify(res?.user));

      router.push(
        res.user?.role === "super_admin" ? "/dashboard" : "/dashboard/general"
      );
    } catch (error: any) {
      setError(error.error);
      console.log(error, "error");
    }
  });

  return (
    <div className="min-h-[100dvh] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <CircleIcon className="h-12 w-12 text-orange-500" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {mode === "signin"
            ? "Sign in to your account"
            : "Create your account"}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <form
          className="space-y-6"
          // action={formAction}
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin({ email, password });
          }}
        >
          {/* <input type="hidden" name="redirect" value={redirect || ''} />
          <input type="hidden" name="priceId" value={priceId || ''} />
          <input type="hidden" name="inviteId" value={inviteId || ''} /> */}
          <div>
            <Label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </Label>
            <div className="mt-1">
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                // defaultValue={state.email}
                required
                maxLength={100}
                className="appearance-none rounded-full relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div>
            <Label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </Label>
            <div className="mt-1 relative ">
              <Input
                id="password"
                name="password"
                type={passwordToggled ? "text" : "password"}
                autoComplete={
                  mode === "signin" ? "current-password" : "new-password"
                }
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                // defaultValue={state.password}
                required
                minLength={8}
                maxLength={100}
                className="absolute z-[2] w-full appearance-none rounded-full relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500  sm:text-sm"
                placeholder="Enter your password"
              />
              <div
                className="absolute right-[10px] top-[50%] translate-y-[-50%] cursor-pointer z-[5] border-red-[500] border-solid"
                onClick={() => setPasswordToggled(!passwordToggled)}
                role="button"
              >
                {passwordToggled ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>
            </div>
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <div>
            <Button
              type="submit"
              className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              disabled={pending}
            >
              {pending ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  Loading...
                </>
              ) : mode === "signin" ? (
                "Sign in"
              ) : (
                "Sign up"
              )}
            </Button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            {/* <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">
                {mode === 'signin'
                  ? 'New to our platform?'
                  : 'Already have an account?'}
              </span>
            </div> */}
          </div>

          {/* <div className="mt-6">
            <Link
              href={`${mode === 'signin' ? '/sign-up' : '/sign-in'}${
                redirect ? `?redirect=${redirect}` : ''
              }${priceId ? `&priceId=${priceId}` : ''}`}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-full shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              {mode === 'signin'
                ? 'Create an account'
                : 'Sign in to existing account'}
            </Link>
          </div> */}
        </div>
      </div>
    </div>
  );
}
