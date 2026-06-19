import { Router } from "express";
import User from "../models/userModel.js";
import passport from "passport";
import jwt from "jsonwebtoken";
import { sendAuthNotification } from "../config/mq.js";

const router = Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/",
  }),
  async (req, res) => {
    try {
      const { id, displayName, emails } = req.user;
      
      // 1. Find the user first
      let user = await User.findOne({ googleId: id });

      // 2. If user doesn't exist, create them
      if (!user) {
        user = new User({
          googleId: id,
          name: displayName,
          email: emails?.[0]?.value,
          avatar: req.user.photos?.[0]?.value,
        });
        await user.save();
      }

      // 3. NOW it is safe to send the notification because `user` is guaranteed to exist and has an `_id`
      await sendAuthNotification({
        userId: user._id,
        action: "google_login",
        email: emails[0].value
      });

      // 4. Generate token and redirect
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      res.cookie("token", token, { httpOnly: true });
      
      // Note: Ensure "http://localhost:5173" is actually where your frontend is running!
      res.redirect("http://localhost:5173"); 
      
    } catch (error) {
      console.error("Error during Google authentication:", error);
      res.status(500).json({ error: "Authentication failed" });
    }
  },
);

export default router;