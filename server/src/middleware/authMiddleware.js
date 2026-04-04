import prisma from "../lib/db.js";

/**
 * Ensure the request is authenticated and attach the authenticated user to the request.
 *
 * Attempts to determine the current user in this order: an existing `req.user`, a `Bearer <token>` Authorization header that maps to a valid session (with an unexpired `expiresAt`), and `req.session.user`. If authentication succeeds, sets `req.userId` and ensures `req.user` exists, then calls `next()`. If no valid user is found, responds with HTTP 401 and a structured JSON error. Any unexpected errors are logged and also result in a 401 JSON response.
 */
export async function authMiddleware(req, res, next) {
  try {
    // Check for session or token
    let userId = null;

    // Method 1: Check for session in request (set by better-auth)
    if (req.user) {
      userId = req.user.id;
    }

    // Method 2: Check for Authorization header (Bearer token)
    if (!userId) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.substring(7);

        // Find user by session token
        const session = await prisma.session.findUnique({
          where: { token },
          include: { user: true },
        });

        if (session && new Date(session.expiresAt) > new Date()) {
          userId = session.user.id;
          req.user = session.user;
        }
      }
    }

    // Method 3: Check for better-auth session data
    if (!userId && req.session?.user) {
      userId = req.session.user.id;
      req.user = req.session.user;
    }

    // Fail if no user found
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: {
          code: "UNAUTHORIZED",
          message: "Authentication required",
        },
        statusCode: 401,
        timestamp: new Date().toISOString(),
      });
    }

    // Attach user to request for use in controllers
    req.userId = userId;
    req.user = req.user || { id: userId };

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(401).json({
      success: false,
      error: {
        code: "UNAUTHORIZED",
        message: "Authentication failed",
      },
      statusCode: 401,
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * Ensure the authenticated user owns the conversation referenced by the route parameter.
 *
 * Must run after authentication middleware; on success attaches the conversation to `req.conversation` and calls `next()`.
 *
 * Errors:
 * - Responds with 400 if the conversation `id` route parameter or `req.userId` is missing.
 * - Responds with 404 if no conversation matching the `id` and `req.userId` exists.
 * - Logs the error and responds with 500 on unexpected failures.
 */
export async function ownershipMiddleware(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.userId;

    if (!id || !userId) {
      return res.status(400).json({
        success: false,
        error: {
          code: "BAD_REQUEST",
          message: "Conversation ID is required",
        },
        statusCode: 400,
        timestamp: new Date().toISOString(),
      });
    }

    // Check if conversation exists and belongs to user
    const conversation = await prisma.conversation.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: {
          code: "NOT_FOUND",
          message: "Conversation not found",
        },
        statusCode: 404,
        timestamp: new Date().toISOString(),
      });
    }

    // Attach conversation to request
    req.conversation = conversation;

    next();
  } catch (error) {
    console.error("Ownership middleware error:", error);
    return res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Error checking conversation ownership",
      },
      statusCode: 500,
      timestamp: new Date().toISOString(),
    });
  }
}
