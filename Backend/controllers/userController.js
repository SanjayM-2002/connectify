import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import generateTokenAndSetCookie from '../utils/helpers/generateTokenAndSetCookie.js';
import { v2 as cloudinary } from 'cloudinary';
import mongoose from 'mongoose';
import Post from '../models/postModel.js';

// Signup User

const signUpUser = async (req, res) => {
  try {
    const { name, email, userName, password } = req.body;
    const user = await User.findOne({ $or: [{ email }, { userName }] });

    if (user) {
      console.log('User already exists');
      return res.status(400).json({ error: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      name,
      email,
      userName,
      password: hashedPassword,
    });
    await newUser.save();
    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);
      res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        userName: newUser.userName,
        bio: newUser.bio,
        profilePic: newUser.profilePic,
      });
      console.log('Successfully signed up');
    } else {
      res.status(400).json({ error: 'Invalid user data' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log('Error in signup user ', err.message);
  }
};

//Login User

const loginUser = async (req, res) => {
  try {
    const { userName, password } = req.body;
    const user = await User.findOne({ userName });
    if (!user) {
      console.log('Invalid username');
      return res.status(400).json({ error: 'Invalid username' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      console.log('Invalid password');
      return res.status(400).json({ error: 'Invalid password' });
    }

    generateTokenAndSetCookie(user._id, res);
    res.status(200).json({
      _id: user._id,
      userName: user.userName,
      name: user.name,
      email: user.email,
      bio: user.bio,
      profilePic: user.profilePic,
    });
    console.log('Logged in successfully');
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log('Error in login user', err.message);
  }
};

// Logout User

const logoutUser = async (req, res) => {
  try {
    res.cookie('jwt', '', { maxAge: 1 });
    res.status(200).json({ message: 'Logged out successfully' });
    console.log('Logged out successfully');
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log('Error in logout', err.message);
  }
};

//Follow and Unfollow User

const followUnfollowUser = async (req, res) => {
  try {
    const id = req.params.id;
    console.log('id from req params is: ', id);
    const userToModify = await User.findById(id);
    const currentUser = await User.findById(req.user._id);

    if (id === req.user._id.toString()) {
      return res
        .status(400)
        .json({ error: 'You cannot follow or unfollow yourself' });
    }
    if (!userToModify) {
      return res.status(401).json({ error: 'Invalid user' });
    }
    if (!currentUser) {
      return res.status(401).json({ error: 'Invalid user' });
    }

    const isFollowing = currentUser.following.includes(id);
    if (isFollowing) {
      //Unfollow
      //Modify following array of currentUser (delete)
      //Modify followers array of userToModify (delete)

      await User.findByIdAndUpdate(req.user._id, {
        $pull: { following: id },
      });
      await User.findByIdAndUpdate(id, {
        $pull: { followers: req.user._id },
      });
      res.status(200).json({ message: 'User unfollowed successfully' });
    } else {
      //Follow
      //Modify following array of currentUser (add)
      //Modify followers array of userToModify (add)

      await User.findByIdAndUpdate(req.user._id, {
        $push: { following: id },
      });
      await User.findByIdAndUpdate(id, {
        $push: { followers: req.user._id },
      });
      res.status(200).json({ message: 'User followed successfully' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log('Error in follow or unfollow', err.message);
  }
};

// Update User

const updateUser = async (req, res) => {
  const { name, email, userName, password, bio } = req.body;
  let { profilePic } = req.body;
  console.log('user object obtained from middleware is: ', req.user);
  const userId = req.user._id;
  try {
    let user = await User.findById(userId);
    if (!user) {
      console.log('Invalid user');
      return res.status(400).json({ error: 'Invalid user' });
    }

    if (req.params.id !== userId.toString()) {
      console.log('You cannot update other profile');
      return res.status(400).json({ error: 'You cannot update other profile' });
    }
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user.password = hashedPassword;
    }
    if (profilePic) {
      if (user.profilePic) {
        await cloudinary.uploader.destroy(
          user.profilePic.split('/').pop().split('.')[0]
        );
      }
      const uploadedResponse = await cloudinary.uploader.upload(profilePic);
      profilePic = uploadedResponse.secure_url;
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.userName = userName || user.userName;
    user.profilePic = profilePic || user.profilePic;
    user.bio = bio || user.bio;

    user = await user.save();

    //Find all posts that the current user replied and update username and user profilPic fields in that reply
    await Post.updateMany(
      { 'replies.userId': userId },
      {
        $set: {
          'replies.$[reply].userName': user.userName,
          'replies.$[reply].userProfilePic': user.profilePic,
        },
      },
      { arrayFilters: [{ 'reply.userId': userId }] }
    );

    res.status(200).json(user);
    console.log('Profile updated successfully');
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log('Error in updating user-profile', err.message);
  }
};

// Get User Profile
// query is either username or user_id

const getUserProfile = async (req, res) => {
  const { query } = req.params;
  try {
    let user;
    if (mongoose.Types.ObjectId.isValid(query)) {
      user = await User.findOne({ _id: query })
        .select('-password')
        .select('-updatedAt');
    } else {
      user = await User.findOne({ userName: query })
        .select('-password')
        .select('-updatedAt');
    }
    // console.log('User is: ', user);
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('User found');
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log('Error in getting user-profile', err.message);
  }
};

export {
  signUpUser,
  loginUser,
  logoutUser,
  followUnfollowUser,
  updateUser,
  getUserProfile,
};
