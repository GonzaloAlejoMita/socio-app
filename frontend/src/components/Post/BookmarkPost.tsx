import { BookmarkPostType } from "../../Types/BookmarkPost.types";
import Card from "../../ui/Card";
import BookmarkImage from "./BookmarkImage";
import BookmarkText from "./BookmarkText";
import UserImage from "../User/UserImage";
import UserFullName from "../User/UserFullName";
import PostBookmarkIcon from "./PostBookmarkIcon";

type Props = {
  post: BookmarkPostType;
  removeBookmarkFunction: (postId: string) => void;
};

const BookmarkPost: React.FC<Props> = ({ post, removeBookmarkFunction }) => {
  const removeBookmarkHandler = () => {
    removeBookmarkFunction(post._id);
  };

  return (
    <Card className="px-8 py-6 !text-left">
      <div className="relative">
        <div className="flex flex-col sm:flex-row gap-4">
          {post.postImage && (
            <BookmarkImage
              src={`https://socio-irdl.onrender.com/post_assets/${post.postImage}`}
              alt=""
              id={post._id}
            />
          )}
          <div className="w-full pr-8 flex flex-col gap-4">
            <BookmarkText text={post.description} id={post._id} />
            <div className="flex flex-row items-center gap-2">
              <UserImage
                className="min-w-[2rem] w-8 min-h-[2rem] h-8"
                src={post.userPicture}
                username={post.username}
                link={true}
              />
              <UserFullName
                className="!text-base text-gray-500 font-medium"
                fullName={post.firstName + " " + post.lastName}
                username={post.username}
              />
            </div>
            <PostBookmarkIcon
              postId={post._id}
              removeBookmark={removeBookmarkHandler}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default BookmarkPost;
