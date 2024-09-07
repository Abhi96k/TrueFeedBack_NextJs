import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  // if (request.method !== "GET") {
  //   return Response.json(
  //     {
  //       success: false,
  //       message: "Invalid request method",
  //     },
  //     { status: 405 }
  //   );
  // }

  await dbConnect();

  try {
    // localhost:3000/api/check-username-unique?username=Abhishek
    const { searchParams } = new URL(request.url);
    // Compare this snippet from feedback/src/app/api/check-username-unique/route.ts:
    const queryParams = {
      username: searchParams.get("username"),
    };

    const result = UsernameQuerySchema.safeParse(queryParams);

    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            usernameErrors?.length > 0
              ? usernameErrors.join(", ")
              : "Invalid query parameters",
        },

        { status: 400 }
      );
    }

    const { username } = result.data;
    //username is unique if no verified user exists with the same username

    const existingVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUser) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken",
        },
        { status: 200 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Username is unique",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error checking username:", error);
    return Response.json(
      {
        success: false,
        message: "Error checking username",
      },
      { status: 500 }
    );
  }
}
