import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
    <div className="w-full max-w-md bg-gray-300 shadow-xl rounded-2xl p-8">
      <SignIn
        path="/sign-in"
        routing="path"
        signUpUrl="/sign-up"
        appearance={{
          elements: {
            card: "bg-gray-300 text-gray-900",
            headerTitle: "text-black",
            headerSubtitle: "text-gray-700",
            socialButtonsBlockButton: "bg-white text-gray-800 border border-gray-300 hover:bg-gray-200",
            dividerText: "text-gray-600",
            formFieldLabel: "text-gray-800",
            formFieldInput: "bg-white text-black placeholder-gray-600 border border-gray-300",
            formButtonPrimary: "bg-gray-800 hover:bg-gray-900 text-white",
            footerActionText: "text-gray-600",
            footerActionLink: "text-indigo-600 hover:text-indigo-700",
            logoBox: "hidden",
          },
        }}
      />
    </div>
  </div>
  );
}