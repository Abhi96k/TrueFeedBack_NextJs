// "use client";

// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import * as z from "zod";
// import { signIn } from "next-auth/react";
// import {
//   Form,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useToast } from "@/components/ui/use-toast";
// import { signInSchema } from "@/schemas/signInSchema";

// export default function SignInForm() {
//   const router = useRouter();

//   const form = useForm<z.infer<typeof signInSchema>>({
//     resolver: zodResolver(signInSchema),
//     defaultValues: {
//       identifier: "",
//       password: "",
//     },
//   });

//   const { toast } = useToast();
//   const onSubmit = async (data: z.infer<typeof signInSchema>) => {
//     const result = await signIn("credentials", {
//       redirect: false,
//       identifier: data.identifier,
//       password: data.password,
//     });

//     if (result?.error) {
//       if (result.error === "CredentialsSignin") {
//         toast({
//           title: "Login Failed",
//           description: "Incorrect username or password",
//           variant: "destructive",
//         });
//       } else {
//         toast({
//           title: "Error",
//           description: result.error,
//           variant: "destructive",
//         });
//       }
//     }

//     if (result?.url) {
//       router.replace("/dashboard");
//     }
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gray-800">
//       <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
//         <div className="text-center">
//           <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
//             Welcome Back to True Feedback
//           </h1>
//           <p className="mb-4">Sign in to continue your secret conversations</p>
//         </div>
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//             <FormField
//               name="identifier"
//               control={form.control}
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Email/Username</FormLabel>
//                   <Input {...field} />
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               name="password"
//               control={form.control}
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Password</FormLabel>
//                   <Input type="password" {...field} />
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <Button className="w-full" type="submit">
//               Sign In
//             </Button>
//           </form>
//         </Form>
//         <div className="text-center mt-4">
//           <p>
//             Not a member yet?{" "}
//             <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
//               Sign up
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { use, useState } from "react";
import { useDebounceValue } from "usehooks-ts";
import { useToast } from "../../../hooks/use-toast";
import { useRouter } from "next/router";
import { signUpSchema } from "@/schemas/signUpSchema";
import { useEffect } from "react";
import axios, { AxiosError } from "axios";
import { set } from "mongoose";

const Page = () => {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debouncedUsername = useDebounceValue(username, 500);

  const { toast } = useToast();
  const router = useRouter();

  //zod implemntion
  const form = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      password: "",
      email: "",
    },
  });

  useEffect(() => {
    const checkusernameUnique = async () => {
      setIsCheckingUsername(true);

      setIsCheckingUsername(false);

      try {
        const response = await axios.get(
          `/api/check-username-unique?username=${debouncedUsername}`
        );

        console.log(response);

        setUsernameMessage(response.data.message);
      } catch (error) {
        const axiosError = error as AxiosError;
        const errorMessage =
          (axiosError.response?.data as { message: string })?.message ||
          "An error occurred";
        setUsernameMessage(errorMessage);
      } finally {
        setIsCheckingUsername(false);
      }
    };
    checkusernameUnique(); 
  }, [debouncedUsername]);

  return <div></div>;
};
