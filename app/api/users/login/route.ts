import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/jwt";

export async function POST(req: Request) {
    try {
        await connectDB();

        const { email, password } = await req.json();

        const user = await User.findOne({ email });
        if (!user) {
            return Response.json({ error: "User not found" }, { status: 404 });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return Response.json({ error: "Invalid credentials" }, { status: 401 });
        }

        const token = signToken({
            userId: user._id,
            email: user.email
        });

        return Response.json({ 
            message: "Login successful", 
            token,
            user 
        });
    } catch (error) {
        return Response.json({ error: "Login failed" }, { status: 500 });
    }
}