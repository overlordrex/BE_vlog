import { createError } from '../error.js';
import Video from '../models/Video.js';
import User from '../models/User.js';

//ADD VIDEO
export const addVideo = async (req, res, next) => {
  const newVideo = new Video({ userId: req.user.id, ...req.body });
  try {
    const savedVideo = await newVideo.save();
    res.status(200).json(savedVideo);
  } catch (err) {
    next(err);
  }
};

//UPDATE VIDEO
export const updateVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return next(createError(404, 'Video not found'));
    if (req.user.id === video.userId) {
      const updateVideo = await Video.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updateVideo);
    } else {
      return next(createError(403, 'you can only update your video'));
    }
  } catch (err) {
    next(err);
  }
};

//GET VIDEO
export const getVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return next(createError(404, 'Video not found'));
    res.status(200).json(video);
  } catch (err) {
    next(err);
  }
};

//ADD VIEW
export const addView = async (req, res, next) => {
  try {
    const video = await Video.findByIdAndUpdate(req.params.id, {
      $inc: { views: 1 },
    });

    res.status(200).json('viewed');
  } catch (err) {
    next(err);
  }
};

//TREND
export const trend = async (req, res, next) => {
  try {
    const video = await Video.find().sort({ views: -1 });
    if (!video) return next(createError(404, 'Video not found'));
    res.status(200).json(video);
  } catch (err) {
    next(err);
  }
};

//RANDOM
export const random = async (req, res, next) => {
  try {
    const video = await Video.aggregate([{ $sample: { size: 40 } }]);
    if (!video) return next(createError(404, 'Video not found'));
    res.status(200).json(video);
  } catch (err) {
    next(err);
  }
};

//SUB
export const getSub = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const subscribed = user.subscribedTo;

    const list = await Promise.all(
      subscribed.map((id) => {
        return Video.find({ userId: id });
      })
    );
    res.status(200).json(list.flat().sort((a, b) => b.createdAt - a.createdAt));
  } catch (err) {
    next(err);
  }
};

//DELETE VIDEO
export const deleteVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return next(createError(404, 'Video not found'));
    if (req.user.id === video.userId) {
      await Video.findByIdAndDelete(req.params.id);
      res.status(200).json('video deleted');
    } else {
      return next(createError(403, 'you can only delete your video'));
    }
  } catch (err) {
    next(err);
  }
};

//TAGS
export const tags = async (req, res, next) => {
  const tags = req.query.tags.split(',');
  try {
    const video = await Video.find({ tags: { $in: tags } }).limit(25);
    res.status(200).json(video);
  } catch (err) {
    next(err);
  }
};

//SEARCH
export const search = async (req, res, next) => {
  const search = req.query.q;
  try {
    const video = await Video.find({
      title: { $regex: search, $options: 'i' },
    }).limit(25);
    res.status(200).json(video);
  } catch (err) {
    next(err);
  }
};
