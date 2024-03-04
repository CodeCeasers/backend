import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

app.post("/users", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    await prisma.$connect();
    const user = await prisma.user.create({
      data: {
        email,
        password: password,
      },
    });

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Manually disconnect Prisma Client when the application is shutting down
process.on("beforeExit", async () => {
  await prisma.$disconnect();
  console.log("Prisma Client disconnected");
});
