import { Router } from "express";
import { signIn, signOut, signUp } from "./auth.controller";

const authRouter = Router();

/**
 * @swagger
 * /api/user/signup:
 *   post:
 *     summary: User Signup
 *     description: Create a new user account.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - emailId
 *               - password
 *             properties:
 *               firstName:
 *                 type: string
 *                 minLength: 3
 *                 example: "John"
 *               lastName:
 *                 type: string
 *                 example: "Doe"
 *                 description: Optional last name
 *               emailId:
 *                 type: string
 *                 format: email
 *                 example: "john.doe@example.com"
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: "SecureP@ss123"
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User created"
 *       400:
 *         description: Email already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Email address already exists"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "An unexpected error occurred"
 */
//? signup route
authRouter.post("/signup", signUp);

//? login route
authRouter.post("/signin", signIn);

//? logout route
authRouter.post("/signout", signOut);

export default authRouter;
