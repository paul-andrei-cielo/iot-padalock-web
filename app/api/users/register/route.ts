import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {

        await connectDB();

        const { firstName, lastName, email, password } = await req.json();

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return Response.json({ error: "User already exists"}, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword
        });

        return Response.json({ message: "User registered", user: newUser });

    } catch (error) {
        return Response.json({ error: "Registration failed" }, { status: 500 });
    }
}