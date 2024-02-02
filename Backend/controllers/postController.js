import User from '../models/userModel.js';
import Post from '../models/postModel.js';
import bcrypt from 'bcryptjs';
import generateTokenAndSetCookie from '../utils/helpers/generateTokenAndSetCookie.js';
import { v2 as cloudinary } from 'cloudinary';

// Create post

const createPost = async (req, res) => {
  try {
    const { postedBy, text } = req.body;
    let { image } = req.body;

    if (!postedBy || !text) {
      return res
        .status(400)
        .json({ error: 'PostedBy and Text fields are required' });
    }
    const user = await User.findById(postedBy);
    console.log('User data from middleware is: ', req.user._id.toString());
    console.log('User data extracted from postedBy is: ', user);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (user._id.toString() !== req.user._id.toString()) {
      return res.status(401).json({ error: 'Unauthorized to create post' });
    }

    const maxLength = 500;
    if (text.length > maxLength) {
      return res
        .status(400)
        .json({ error: `Text must be less than ${maxLength} characters` });
    }

    if (image) {
      const uploadedResponse = await cloudinary.uploader.upload(image);
      image = uploadedResponse.secure_url;
    }

    const newPost = new Post({ postedBy, text, image });
    await newPost.save();
    console.log('New post created successfully');
    console.log('New post is: ', newPost);
    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log('Error in creating post', err.message);
  }
};

// Get Posts

const getPost = async (req, res) => {
  try {
    const postId = req.params.id;
    console.log('post id from req param is: ', postId);
    const post = await Post.findById(postId);

    if (!post) {
      console.log('Post does not exist');
      return res.status(400).json({ error: 'Post does not exist' });
    }

    console.log('Post found');
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log('Error in creating post', err.message);
  }
};

// Delete Post

const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    console.log('Post id from req params is: ', postId);
    const post = await Post.findById(postId);

    if (!post) {
      console.log('Post not found');
      return res.status(400).json({ error: 'Post not found' });
    }

    console.log('Data from middleware: ', req.user);

    if (post.postedBy.toString() !== req.user._id.toString()) {
      console.log('You cant delete post created by others');
      return res
        .status(401)
        .json({ error: 'You cant delete post created by others' });
    }

    await Post.findByIdAndDelete(post);
    if (post.image) {
      const imageId = post.image.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(imageId);
    }
    console.log('Post deleted successfully');
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log('Error in deleting post', err.message);
  }
};

// Like or Unlike post

const likeUnlikePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;
    const post = await Post.findById(postId);

    if (!post) {
      console.log('Post not found');
      return res.status(404).json({ error: 'Post not found' });
    }

    const userLikedPost = await post.likes.includes(userId);
    if (userLikedPost) {
      //Unlike
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
      console.log('Unliked successfully');
      res.status(200).json({ message: 'Unliked successfully' });
    } else {
      //Like
      post.likes.push(userId);
      await post.save();
      console.log('Liked successfully');
      res.status(200).json({ message: 'Liked successfully' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log('Error in liking/unliking post', err.message);
  }
};

// Reply to a post

const replyToPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { text } = req.body;
    const userId = req.user._id;
    const userName = req.user.userName;
    const name = req.user.name;
    const userProfilePic = req.user.profilePic;

    if (!text) {
      console.log('Text field is required');
      return res.status(400).json({ error: 'Text field is required' });
    }

    const post = await Post.findById(postId);

    if (!post) {
      console.log('Post not found');
      return res.status(404).json({ messagfe: 'Post not found' });
    }
    const newReply = { text, userId, userName, userProfilePic, name };
    console.log('New reply is: ', newReply);
    post.replies.push(newReply);
    await post.save();
    console.log('Reply added successfully');
    res.status(200).json(newReply);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log('Error in replying to a post', err.message);
  }
};

// Get Posts in the Feed

const getFeedPosts = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ error: 'User not found' });
    }

    const userFollowing = user.following;
    const feedPosts = await Post.find({
      postedBy: { $in: userFollowing },
    }).sort({ createdAt: -1 });
    console.log(
      'Posts of following will be obtained in descending order according to posted date'
    );
    res.status(200).json(feedPosts);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log('Error in getting feed posts', err.message);
  }
};

const getUserPosts = async (req, res) => {
  try {
    const userName = req.params.userName;

    const user = await User.findOne({ userName: userName });
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ error: 'User not found' });
    }

    const posts = await Post.find({ postedBy: user._id }).sort({
      createdAt: -1,
    });
    console.log('No error');
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log('Error in creating post', err.message);
  }
};

export {
  createPost,
  getPost,
  deletePost,
  likeUnlikePost,
  replyToPost,
  getFeedPosts,
  getUserPosts,
};
