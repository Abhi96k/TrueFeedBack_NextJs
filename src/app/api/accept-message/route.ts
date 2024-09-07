import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {User} from "next-auth";
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


export async function POST(request:Request){
await dbConnect();

}