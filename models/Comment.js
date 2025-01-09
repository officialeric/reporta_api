const db = require('../config/db');

const newComment = async (comments, userId) => {
    const { comment } = comments;

    const query = 'INSERT INTO comments (content, UserID, created_at) VALUES (?, ? , NOW())';
    result =  await  db.execute(query, [comment, userId]);

    return !!result;
};

const pendingCommentCounts = async () => {
    const query = 'SELECT COUNT(*) as pendingCommentCounts FROM comments WHERE status = ?';
    const comments = await db.execute(query, ['pending']);

    return comments[0][0].pendingCommentCounts;

}

const allComments = async () => {
    const query = `
        SELECT c.* , u.UserName
        FROM comments c 
        INNER JOIN  users u on u.UserID = c.UserID
        WHERE c.status = ?
        ORDER BY c.created_at DESC;
    `;
    const comments = await db.execute(query, ['pending']);

    return comments[0];
}
const doneAComment = async (CommentID) => {
    const query = `
        UPDATE comments SET status = ? WHERE CommentID = ?
    `;
    const comments = await db.execute(query, ['done',CommentID]);

    return !!comments;
}
    
module.exports = {
    newComment, pendingCommentCounts , allComments, doneAComment
}