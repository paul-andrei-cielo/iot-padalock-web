import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        await connectDB();

        const body = await req.json();
        
        const { firstName, lastName, email, password } = body;
        
        if (!firstName || !lastName || !email || !password) {
            return Response.json({ 
                error: "Missing required fields: firstName, lastName, email, password" 
            }, { status: 400 });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser && !existingUser.isDeleted) {
        return Response.json({ error: "User already exists" }, { status: 400 });
        }

        if (existingUser && existingUser.isDeleted) {
            const hashedPassword = await bcrypt.hash(password, 10);

            existingUser.firstName = firstName.trim();
            existingUser.lastName = lastName.trim();
            existingUser.password = hashedPassword;
            existingUser.isDeleted = false;
            existingUser.deletedAt = null;

            await existingUser.save();

            const { password: _, ...userResponse } = existingUser.toObject();

            return Response.json({
                message: "Account restored successfully",
                user: userResponse,
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim(),
            password: hashedPassword
        });

        const { password: _, ...userResponse } = newUser.toObject();
        return Response.json({ message: "User registered", user: userResponse });

    } catch (error) {
        console.error("Registration error:", error);
        return Response.json({ error: "Registration failed" }, { status: 500 });
    }
}