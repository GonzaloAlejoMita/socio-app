import { useState } from "react";
import { useSelector } from "react-redux";
import { BsThreeDots } from "react-icons/bs";
import { FaPen, FaRegBookmark, FaRegTrashAlt } from "react-icons/fa";
import { FaBookmark } from "react-icons/fa6";
import { ImBlocked } from "react-icons/im";
import { PiWarningBold } from "react-icons/pi";
import { selectUser } from "../../store/slices/authSlice";
import useProfileActions from "../../hooks/useProfileActions";
import usePostActions from "../../hooks/usePostActions";
import Button from "../../ui/Button";

type Props = {
  postId: string;
  username: string;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  removePost: (postId: string) => void;
};

const PostMenu: React.FC<Props> = ({
  postId,
  username,
  setIsEditing,
  removePost,
}) => {
  const [menuOpened, setMenuOpened] = useState(false);

  const currentUser = useSelector(selectUser);

  const [inBookmarks, setInBookmarks] = useState<boolean>(
    currentUser!.bookmarks?.includes(postId)
  );

  const { toggleBlockUser, reportUser } = useProfileActions();

  const { toggleBookmarkPost, deletePost } = usePostActions();

  const toggleBookmarkHandler = () => {
    toggleBookmarkPost(postId);
    setInBookmarks((prevState) => !prevState);
    setMenuOpened(false);
  };

  const editHandler = () => {
    setIsEditing(true);
    setMenuOpened(false);
  };

  const deleteHandler = async () => {
    await deletePost(postId);
    setMenuOpened(false);
    removePost(postId);
  };

  const toggleBlockHandler = () => {
    toggleBlockUser(username);
    setMenuOpened(false);
  };

  const reportHandler = () => {
    reportUser();
    setMenuOpened(false);
  };

  return (
    <>
      <BsThreeDots
        className="text-base sm:text-xl cursor-pointer"
        onClick={() => setMenuOpened((prevState) => !prevState)}
      />
      {menuOpened && (
        <ul className="absolute top-6 right-0 px-4 py-5 bg-white rounded border border-gray-10 shadow-md flex flex-col gap-2 sm:gap-4">
          <li>
            <Button
              text={inBookmarks ? "Unbookmark" : "Bookmark"}
              bg={false}
              onClick={toggleBookmarkHandler}
              icon={inBookmarks ? FaBookmark : FaRegBookmark}
              className="text-sm sm:text-base"
              iconClasses="!text-xs sm:!text-sm"
            />
          </li>
          {currentUser!.username === username && (
            <>
              <li>
                <Button
                  text="Edit Post"
                  bg={false}
                  onClick={editHandler}
                  icon={FaPen}
                  className="text-sm sm:text-base"
                  iconClasses="!text-xs sm:!text-sm"
                />
              </li>
              <li>
                <Button
                  text="Delete Post"
                  bg={false}
                  onClick={deleteHandler}
                  icon={FaRegTrashAlt}
                  className="text-sm sm:text-base"
                  iconClasses="!text-xs sm:!text-sm"
                />
              </li>
            </>
          )}
          {currentUser!.username !== username && (
            <>
              <li>
                <Button
                  text="Block"
                  bg={false}
                  onClick={toggleBlockHandler}
                  icon={ImBlocked}
                  className="text-sm sm:text-base"
                  iconClasses="!text-xs sm:!text-sm"
                />
              </li>
              <li>
                <Button
                  text="Report"
                  bg={false}
                  onClick={reportHandler}
                  icon={PiWarningBold}
                  className="text-sm sm:text-base"
                  iconClasses="!text-xs sm:!text-lg"
                />
              </li>
            </>
          )}
        </ul>
      )}
    </>
  );
};

export default PostMenu;
