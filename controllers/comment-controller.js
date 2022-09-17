const {Pizza, Comment} = require('../models');

const commentController = {
    // add comment
    addComment({params, body}, res) {
        console.log(body);
        Comment.create(body)
        .then(({_id}) => {
            return Pizza.findOneAndUpdate({
                _id: params.pizzaId
            }, {
                $push: {
                    comments: _id
                }
            }, {
                new: true
            });
        })
        .then(dbPizzaData => {
            if(!dbPizzaData) {
                res.status(400).json({message: 'No pizza found with this id'});
                return;
            }
            res.json(dbPizzaData);
        })
        .catch(err => console.log(err));
    },
    // remove comment
    removeComment({params, body}, res) {
        Comment.findOneAndDelete({
            _id: params.commentId
        })
        .then(dbCommentData => {
            if (!dbCommentData) {
                res.status(400).json({message: 'No comment found with this id'});
                return;
            }
            return Pizza.findOneAndUpdate({
                _id: params.pizzaId
            }, {
                $pull: {
                    comments: params.commentId
                }
            }, {
                new: true
            });
        })
        .then(dbPizzaData => {
            if (!dbPizzaData) {
                res.status(400).json({message: 'No pizza found with this id'});
                return;
            }
            res.json(dbPizzaData);
        })
        .catch(err => console.log(err));
    }
};

module.exports = commentController;