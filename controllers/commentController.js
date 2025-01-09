const Comment = require('../models/Comment');

const addComment = async (req, res) => {

    const comment = req.body;
    const {userId} = req.user;

    try {
        const comments = await Comment.newComment(comment,userId);

        if (!comments) {
            return res.status(400).json(
                {
                    message: 'Comment not added'
                }
            )
        } else {
            return res.status(200).json(
                {
                    message: 'Comment added successfully',
                }
            )
        }

    } catch (error) {
        res.status(500).json(
            {
                message: error.message
            }
        )
    }
}

const pendingCount =async (req,res) => {
    try {
        const result = await Comment.pendingCommentCounts();
  
        res.status(200).json({
            data : result
        })
    } catch (error) {
        console.error(error)
    }
  }

  const getAllComments = async (req, res) => {
    try {
      const allComment = await Comment.allComments();

    //   console.log(allGroup)
      res.status(200).json({
        data : allComment
      }); 
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  };
  const doneComment = async (req, res) => {

    const CommentID = req.params.id;

    try {
      const result = await Comment.doneAComment(CommentID);

    if(result){

        res.status(200).json({
            message : 'Comment done successfully'
        }); 
    }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  };
module.exports = {
    addComment, pendingCount ,getAllComments , doneComment
}
