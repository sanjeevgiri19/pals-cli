import express from "express";
import { auth } from "./lib/auth.js";
import { fromNodeHeaders, toNodeHandler } from "better-auth/node";
import cors from "cors";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import conversationRoutes from "./routes/conversations.js";
import messageRoutes from "./routes/messages.js";
import meRoutes from "./routes/me.js";

const app = express();
const port = process.env.PORT || 3005;

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "https://pals-cli.vercel.app/",
    // "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());

// Register API routes
app.use("/api/me", meRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/messages", messageRoutes);

// Fixed: This endpoint now properly handles Bearer token authentication
// app.get("/api/me", async (req, res) => {
//   try {
//     const session = await auth.api.getSession({
//       headers: fromNodeHeaders(req.headers),
//     });

//     if (!session) {
//       return res.status(401).json({ error: "No active session" });
//     }

//     return res.json(session);
//   } catch (error) {
//     console.error("Session error:", error);
//     return res
//       .status(500)
//       .json({ error: "Failed to get session", details: error.message });
//   }
// });

// // You can remove this endpoint if you're using the Bearer token approach above
// app.get("/api/me/:access_token", async (req, res) => {
//   const { access_token } = req.params;

//   try {
//     const session = await auth.api.getSession({
//       headers: {
//         authorization: `Bearer ${access_token}`,
//       },
//     });

//     if (!session) {
//       return res.status(401).json({ error: "Invalid token" });
//     }

//     return res.json(session);
//   } catch (error) {
//     console.error("Token validation error:", error);
//     return res
//       .status(401)
//       .json({ error: "Unauthorized", details: error.message });
//   }
// });

const clientAppUrl = (
  process.env.CLIENT_APP_URL || "https://pals-cli.vercel.app/"
  // "http://localhost:3000"
).replace(/\/$/, "");

app.get("/device", async (req, res) => {
  try {
    const { user_code } = req.query;
    if (!user_code) {
      return res.status(400).json({ error: "user_code is required" });
    }
    res.redirect(`${clientAppUrl}/device?user_code=${encodeURIComponent(user_code)}`);
  } catch (error) {
    console.error("Device redirect error:", error);
    res.status(500).json({ error: "Redirect failed", details: error.message });
  }
});

// 404 handler for unmatched routes
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
