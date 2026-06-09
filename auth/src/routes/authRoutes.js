import { Router } from "express";
import User from "../models/User.js";
import passport from "passport";

const router = Router()

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/" }), async (req, res) => {
    try {
        const { id, displayName, emails } = req.user;
        let user = await User.findOne({ googleId: id });
        if (!user) {
            user = new User({
                googleId: id,
                name: displayName,
                email: emails?.[0]?.value,
                avatar: req.user.photos?.[0]?.value
            });
            await user.save();

            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

            res.cookie("token", token, { httpOnly: true})
            res.redirect("/")
        }
    } catch (error) {
        console.error("Error during Google authentication:", error);
    }
})
export default router;