import * as mongoose from 'mongoose';
import { Types } from 'mongoose';

const now = () => Math.floor(Date.now() / 1000);

/**
 * Represents an Article document in the database.
 */
export const ArticleSchema = new mongoose.Schema({
  //author: author of the article, as id.
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // name: the name of the article in the URL (no spaces/capitals)
  name: {
    type: String,
    maxlength: 100,
    unique: true
  },

  // title: title of the article.
  title: {
    type: String,
    required: true,
  },

  // tags: list of the article's tags
  tags: [String],

  // brief: brief description of the article (displayed on the homepage).
  brief: {
    type: String
  },

  // image: url of the article's image.
  image: {
    type: String
  },

  // attr: attribution of the image, displayed on the article page under the image.
  attr: {
    type: String
  },

  // text: text of the article.
  text: {
    type: String,
  },

  // public: whether the article is public.
  public: {
    type: Boolean,
    default: false
  },

  // List of comments
  comments: [{
    name: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Number,
      required: true,
      default: now
    }
  }],

  clicks: {
    type: Number,
    default: 1
  },

  createdAt: {
    type: Number,
    default: now
  },

  updatedAt: {
    type: Number,
    default: now
  }
})

/**
 * Indexes all string fields in the Article schema for searching purposes.
 */
ArticleSchema.index({'$**': 'text'});
