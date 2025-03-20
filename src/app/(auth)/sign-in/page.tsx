"use client";

import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useSessionContext, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

const SignIn = () => {
  const supabaseClient = useSupabaseClient();
  const { session, isLoading } = useSessionContext();
  const router = useRouter();

  useEffect(() => {
    if (session?.user && !isLoading) {
      router.replace('/dashboard');
    }
  }, [session, isLoading, router]);

  if (isLoading) return null;

  return (
    <div className="min-h-screen bg-[#070c1b] flex items-center justify-center px-4 relative">
      {/* Simple, elegant background matching homepage */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[100px]"></div>
      </div>

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center">
            <div className="mr-3 h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-2xl">B</span>
            </div>
            <span className="text-white font-bold text-3xl">Brochure<span className="text-blue-500">AI</span></span>
          </div>
        </div>

        {/* Welcome text */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            <span className="text-white">Welcome </span>
            <span className="text-blue-500">back</span>
          </h1>
          <p className="text-gray-300 text-lg">
            Enter your email to sign in or create your next beautiful real estate brochure
          </p>
        </div>

        {/* Auth container - matching homepage card styling */}
        <div className="bg-[#0c1324] border border-[#1c2a47] rounded-xl overflow-hidden shadow-xl">
          <div className="p-8">
            <Auth
              supabaseClient={supabaseClient}
              providers={[]}
              magicLink={true}
              appearance={{
                theme: ThemeSupa,
                variables: {
                  default: {
                    colors: {
                      brand: "#3B82F6",
                      brandAccent: "#60A5FA",
                      inputBackground: "#111b33",
                      inputBorder: "#1c2a47",
                      inputBorderHover: "#3B82F6",
                      inputBorderFocus: "#3B82F6",
                    },
                    radii: {
                      borderRadiusButton: "0.5rem",
                      buttonBorderRadius: "0.5rem",
                      inputBorderRadius: "0.5rem",
                    },
                    space: {
                      inputPadding: "14px",
                      buttonPadding: "14px",
                    },
                  },
                },
                className: {
                  button: "bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-medium hover:shadow-md transition-all",
                  input: "focus:ring-1 focus:ring-blue-500",
                  label: "text-gray-300 font-medium",
                  anchor: "text-blue-400 hover:text-blue-300",
                  message: "text-red-400",
                }
              }}
              theme="dark"
              localization={{
                variables: {
                  sign_in: {
                    email_label: "Email address",
                    password_label: "Password",
                    button_label: "Sign in",
                    loading_button_label: "Signing in...",
                    email_input_placeholder: "Your email address",
                    password_input_placeholder: "Your password"
                  }
                }
              }}
            />
          </div>
        </div>
        
        {/* Back to home link */}
        <div className="mt-8 text-center">
          <Link href="/" className="inline-flex items-center text-gray-400 hover:text-blue-400 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignIn;