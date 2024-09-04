import { Message } from "@/model/User";

export interface ApiResponse {
  success: boolean;
  message: string;
  isAccpectingMessages?: boolean;
  messages?: Array<Message>;
}

