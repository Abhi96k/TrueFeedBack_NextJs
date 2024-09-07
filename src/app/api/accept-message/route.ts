import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
//this user from next-auth is different from the user from the model
//when the user is authenticated

//getserversession:-
//getserver session is a function that takes a request object and returns a session object
//if the request is authenticated, otherwise it returns null
//this function is used to get the session object on the server side
//this is useful when you want to protect your api routes with authentication
//you can use this function to get the session object in the api route handler
//we already injected user object in the request object in the previous step
//so we can use that to check if the user is authenticated
//getseversession function is provided by backedn provider

export async function POST(request: Request) {
  // Connect to the database
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user;
  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not authenticated",
      },
      {
        status: 401,
      }
    );
  }

  const userId = user._id;
  const { acceptMessages } = await request.json();

  try {
    // Update the user's message acceptance status
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        isAcceptingMessages: acceptMessages,
      },
      {
        new: true,
      }
      //new:true returns the updated document
    );

    if (!updatedUser) {
      // User not found
      return Response.json(
        {
          success: false,
          message: "Unable to find user to update message acceptance status",
        },
        {
          status: 404,
        }
      );
    }

    // Successfully updated message acceptance status
    return Response.json(
      {
        success: true,
        message: "Message acceptance status updated successfully",
        updatedUser,
      }, 
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error updating message acceptance status:", error);
    return Response.json(
      {
        success: false,
        message: "Error updating message acceptance status",
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET(request: Request) {
  // Connect to the database
  await dbConnect();

  // Get the user session
  const session = await getServerSession(authOptions);
  const user = session?.user;

  // Check if the user is authenticated
  if (!session || !user) {
    return Response.json(
      {
        success: false,
        message: "Not authenticated",
      },
      {
        status: 401,
      }
    );
  }

  try {
    // Retrieve the user from the database using the ID
    const foundUser = await UserModel.findById(user._id);

    if (!foundUser) {
      // User not found
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    // Return the user's message acceptance status
    return Response.json(
      {
        success: true,
        isAcceptingMessages: foundUser.isAcceptingMessages,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error retrieving message acceptance status:", error);
    return Response.json(
      {
        success: false,
        message: "Error retrieving message acceptance status",
      },
      {
        status: 500,
      }
    );
  }
}
