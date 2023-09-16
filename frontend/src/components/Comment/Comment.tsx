import { useState } from "react";
import { Comment as CommentType } from "../../Types/Comment.types";
import CommentForm from "./CommentForm";
import UserImage from "../User/UserImage";
import UserFullName from "../User/UserFullName";
import CommentDate from "./CommentDate";
import CommentMenu from "./CommentMenu";
import CommentText from "./CommentText";

type Props = {
  comment: CommentType;
  removeCommentFunction: (commentId: string) => void;
  editCommentFunction: (commentId: string, text: string) => void;
};

const Comment: React.FC<Props> = ({ comment, removeCommentFunction, editCommentFunction }) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <>
      {isEditing ? (
        <CommentForm
          commentId={comment._id}
          commentText={comment.text}
          setIsEditing={setIsEditing}
          editCommentFunction={editCommentFunction}
        />
      ) : (
        <div className="flex flex-row items-start gap-2 group">
          <UserImage
            className="min-w-[2.5rem] min-h-[2.5rem] w-10 h-10 !mb-0 translate-y-2"
            src={comment.author.userPicture}
            alt={comment.author.firstName + " " + comment.author.lastName}
            username={comment.author.username}
          />
          <div className="flex flex-col gap-1 sm:gap-0.5 bg-[#f2f2f2] px-4 py-3 rounded-2xl">
            <div className="relative w-fit flex flex-row sm:items-center gap-1 sm:gap-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                <UserFullName
                  className="text-sm sm:!text-base"
                  fullName={
                    comment.author.firstName + " " + comment.author.lastName
                  }
                  username={comment.author.username}
                />
                <CommentDate date={comment.createdAt} />
              </div>
              <CommentMenu
                commentId={comment._id}
                commentAuthorUsername={comment.author.username}
                setIsEditing={setIsEditing}
                removeCommentFunction={removeCommentFunction}
                editCommentFunction={editCommentFunction} 
              />
            </div>
            <CommentText text={comment.text} />
          </div>
        </div>
      )}
    </>
  );
};

export default Comment;
