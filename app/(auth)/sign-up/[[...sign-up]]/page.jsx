"use client";

import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="min-h-screen pt-16 bg-linear-to-br from-indigo-50 via-white to-purple-50">
      <div className="mx-auto flex max-w-5xl min-h-[calc(100vh-4rem)] items-center justify-center px-6">
        <div className="w-full max-w-lg">
          <div className="overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-gray-200/50">
            <div className="h-2 bg-linear-to-r from-indigo-500 to-purple-600" />

            <div className="px-10 py-12 lg:px-14">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900">
                  Create your account
                </h1>
                <p className="mt-4 text-lg text-gray-600">
                  Join us and unlock all features
                </p>
              </div>

              <div className="mt-10">
                <SignUp
                  appearance={{
                    elements: {
                      card: "shadow-none border-none p-0 bg-transparent",
                      headerTitle: "hidden",
                      headerSubtitle: "hidden",
                      formButtonPrimary:
                        "w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-4 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl",
                      socialButtonsBlockButton:
                        "w-full border border-gray-300 hover:bg-gray-50 rounded-xl py-3.5 transition-all duration-200 font-medium",
                      formFieldInput:
                        "rounded-xl border-gray-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all",
                      formFieldLabel: "font-medium text-gray-700",
                      footerAction: "text-center mt-8",
                      footerActionLink:
                        "font-semibold text-indigo-600 hover:text-indigo-700 underline-offset-4 hover:underline",
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
