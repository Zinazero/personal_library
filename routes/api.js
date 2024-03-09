'use strict';

const mongoose = require('mongoose');
const Book = require('./models/book.js');

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      Book.find({})
        .exec()
        .then(books => {
          res.json(books);
        })
        .catch(err => {
          console.log(err);
          res.status(500).json({ error: "an error has occurred" })
        })
    })
    
    .post(async function (req, res){
      let title = req.body.title;

      if (!title) {
        return res.send("missing required field title")
      }

      try {
        let newBook = new Book({
          title: title,
          commentcount: 0
        });

        let savedBook = await newBook.save();

        return res.json({ _id: savedBook._id, title: savedBook.title, commentcount: savedBook.commentcount });
        
      } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "failed to submit new book" });
      };
    })
    
    .delete(function(req, res){
      Book.deleteMany({})
        .exec()
        .then(res.send("complete delete successful"))
      .catch(err => {
        console.log(err);
        res.status(500).json({ error: "an error has occurred" });
      })
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookId = req.params.id;
      Book.findOne({ _id: bookId })
        .exec()
        .then(book => {
          if (book === null) {
           return res.send("no book exists");
          }
          res.json(book);
        })
        .catch(err => {
          console.log(err);
          res.status(500).json({ error: "an error has occurred" })
        })
    })
    
    .post(function(req, res){
      let bookId = req.params.id;
      let comment = req.body.comment;

      if (!comment) {
        return res.send("missing required field comment");
      }
      
      Book.findOneAndUpdate(
        { _id: bookId },
        { $push: { comments: comment } },
        { new: true }
      )
        .exec()
        .then(updatedBook => {
          if (updatedBook === null) {
            return res.send("no book exists");
          }
          updatedBook.commentcount = updatedBook.comments.length;
          updatedBook.save();
          res.json(updatedBook);
        })
      .catch(err => {
        console.log(err);
        res.status(500).json({ error: "an error has occurred" });
      })
    })
    
    .delete(function(req, res){
      let bookId = req.params.id;

      Book.deleteOne({ _id: bookId })
        .exec()
        .then(deletedBook => {
          if (deletedBook.deletedCount === 0) {
            return res.send("no book exists");
          }
          res.send("delete successful");
        })
        .catch(err => {
          console.log(err);
          res.status(500).json({ error: "an error has occurred" });
        })
    });
};
