import prisma from "../lib/db.js";
import { sendSuccess, sendError } from "../utils/response.js";

/**
 * Return the authenticated user's profile (Bearer session or cookie session).
 */
export async function getMe(req, res, next) {
  try {
    const userId = req.userId;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    });

    if (!user) {
      return res
        .status(404)
        .json(sendError("NOT_FOUND", "User not found", 404));
    }

    return res.status(200).json(sendSuccess(user, 200));
  } catch (error) {
    next(error);
  }
}
