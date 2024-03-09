const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const bookSchema = new Schema({
  title: { type: String, required: true },
  commentcount: { type: Number, required: true },
  comments: Array
});
const Book = new mongoose.model("Book", bookSchema);
module.exports = Book;