import "dotenv/config";
import express from "express";
import morgan from "morgan";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import mongoose from "mongoose";
const app = express();

app.use(morgan("dev"));
app.use(cookies());
app.use(passport.initialize());

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      // Here you would typically find or create a user in your database
      // For simplicity, we'll just return the profile
      return done(null, profile);
    },
  ),
);

export default app;
