import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/Users.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const user = await UserModel.findOne({ username });

  if (user) {
    return res.json({ message: "User already exists" });
  } else {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({ username, password: hashedPassword });
    await newUser.save();
    return res.json({ message: "Registeration Succesfull" });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await UserModel.findOne({ username });
  if (!user) {
    return res.json({ message: "User does not exist", staus: false });
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.json({
      message: "Username or Password Is Incorrect!",
      status: false,
    });
  }
  const token = jwt.sign({ id: user._id }, "secret");
  res.json({ token, user, status: true });
});

router.get("/getAllUsers/:id", async (req, res) => {
  try {
    const users = await UserModel.find({ _id: { $ne: req.params.id } }).select([
      "username",
      "avatarImage",
      "_id",
    ]);
    res.json(users);
  } catch (err) {
    console.error(err);
  }
});

router.post("/setAvatar/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const avatarImage = req.body.image;
    const userData = await UserModel.findByIdAndUpdate(
      userId,
      {
        isAvatarImageSet: true,
        avatarImage,
      },
      { new: true }
    );

    return res.json({
      isSet: userData.isAvatarImageSet,
      image: userData.avatarImage,
    });
  } catch (error) {
    console.error(error);
  }
});

export { router as userRouter };

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, "secret", (err) => {
      if (err) {
        return res.sendStatus(403);
        next();
      }
    });
  } else {
    res.sendStatus(401);
  }
};
