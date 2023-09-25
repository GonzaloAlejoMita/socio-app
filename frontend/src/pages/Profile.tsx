import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../store/slices/authSlice";
import { PostType } from "../Types/Post.types";
import useAxios from "../hooks/useAxios";
import PostForm from "../components/Post/PostForm";
import Posts from "../components/Post/Posts";
import PostsSkeleton from "../skeletons/PostsSkeleton";
import { Socket } from "socket.io-client";

type Props = {
  socket: Socket;
};

const Profile: React.FC<Props> = ({ socket }) => {
  const { username } = useParams();
  const currentUser = useSelector(selectUser);
  const isMyProfile = currentUser?.username === username;

  const [posts, setPosts] = useState<PostType[]>([]);

  const {
    data: profilePosts,
    loading: profilePostsIsLoading,
    reFetch: reFetchPosts,
  } = useAxios<PostType[]>(
    `http://localhost:5000/api/v1/posts/user/${username}`,
    "get"
  );

  useEffect(() => {
    if (profilePosts) {
      setPosts(profilePosts);
    }
  }, [profilePosts]);

  const removePost = (postId: string) => {
    setPosts((prevState) =>
      prevState.filter((post: PostType) => post._id !== postId)
    );
  };

  const updatePost = (postId: string, description: string, image: string) => {
    setPosts((prevState) => {
      const updatedPosts: PostType[] = [];
      prevState.forEach((post) => {
        if (post._id === postId) {
          updatedPosts.push({
            ...post,
            description: description,
            postImage: image,
          });
        } else {
          updatedPosts.push(post);
        }
      });
      return updatedPosts;
    });
  };

  return (
    <>
      {isMyProfile && <PostForm fetchPosts={reFetchPosts} />}
      {profilePostsIsLoading ? (
        <PostsSkeleton postsNumber={2} />
      ) : posts.length > 0 ? (
        <Posts
          posts={posts}
          removePost={removePost}
          updatePost={updatePost}
          socket={socket}
        />
      ) : (
        <div className="text-center text-gray-800 text-xl">
          {isMyProfile ? "You" : "This user"} didn't post anything yet.
        </div>
      )}
    </>
  );
};

export default Profile;
