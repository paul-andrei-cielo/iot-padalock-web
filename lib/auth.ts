import { verifyToken } from "./jwt";
import { NextRequest } from "next/server";

export function getUserFromRequest(req: NextRequest) {
    try {
        const authHeader = req.headers.get("authorization");

        if (!authHeader?.startsWith('Bearer ')) {
            throw new Error("No token provided");
        }

        const token = authHeader.split(" ")[1];
        const user = verifyToken(token);

        if (!user) {
            throw new Error("Invalid token");
        }

        return verifyToken(token) as any;
    } catch (error) {
        throw new Error("Invalid or expired token")
    }
}