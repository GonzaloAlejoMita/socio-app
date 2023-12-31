import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import { BsSearch } from "react-icons/bs";
import { FaMoon, FaSun } from "react-icons/fa";
import { FiMenu } from "react-icons/fi";
import { AiFillMessage } from "react-icons/ai";
import { MdClose } from "react-icons/md";
import { IoIosNotifications } from "react-icons/io";
import axios, { AxiosResponse } from "axios";
import { RootState } from "../store/store";
import { selectMode, selectUser, toggleMode } from "../store/slices/authSlice";
import { selectSideOpen, toggleSidebar } from "../store/slices/sidebarSlice";
import { ProfileType } from "../Types/Profile.types";
import { PostType } from "../Types/Post.types";
import { NotificationType } from "../Types/Notification.types";
import UserImage from "./User/UserImage";
import Notifications from "./Notifications";

type Props = {
  navIsSticky: boolean;
  notifications: NotificationType[];
  setNotifications: React.Dispatch<React.SetStateAction<NotificationType[]>>;
};

const Navbar: React.FC<Props> = ({
  navIsSticky,
  notifications,
  setNotifications,
}) => {
  const dispatch: ThunkDispatch<RootState, void, AnyAction> = useDispatch();
  const user = useSelector(selectUser);
  const mode = useSelector(selectMode);
  const sideOpen = useSelector(selectSideOpen);

  const handleSidebar = () => {
    dispatch(toggleSidebar());
  };

  const handleModeToggle = () => {
    dispatch(toggleMode());
  };

  const [isOpen, setIsOpen] = useState(false);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{
    users: ProfileType[];
    posts: PostType[];
  }>({ users: [], posts: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (query.length > 2) {
        setLoading(true);
        try {
          const response: AxiosResponse<{
            users: ProfileType[];
            posts: PostType[];
          }> = await axios.get(
            `https://socio-irdl.onrender.com/api/v1/search?query=${query}`
          );
          setResults(response.data);
          setLoading(false);
        } catch (error) {
          console.error("Error searching:", error);
          setLoading(false);
        }
      }
    };

    const debounceTimeout = setTimeout(fetchSearchResults, 500);
    return () => clearTimeout(debounceTimeout);
  }, [query]);

  const renderSearchResults = useCallback(() => {
    if (loading) {
      return (
        <span className="font-bold bg-white w-full text-center dark:text-textLighter dark:bg-primarylessDark absolute p-3">
          Loading...
        </span>
      );
    }

    if (query.length > 2) {
      return (
        <div className="absolute px-4 py-4 shadow-md max-h-[400px] overflow-y-auto hidden b-0 z-50 w-full bg-white p-2 md:grid grid-cols-1 scrollbar scrollbar-w-2 scrollbar-thumb-sky-500 hover:scrollbar-thumb-sky-600 scrollbar-track-gray-200 dark:scrollbar-track-primarylessDarker dark:bg-primarylessDark">
          {results.users.length > 0 && (
            <p className="text-gray-400 font-semibold text-base dark:text-textLighter">
              USERS
            </p>
          )}
          {results.users.length > 0 &&
            results.users.map((user) => (
              <Link
                to={`/profile/${user.username}`}
                className="flex font-semibold my-2 pt-2"
                key={user.username}
                onClick={() => setQuery("")}
              >
                <UserImage
                  src={user.userPicture}
                  username={user.username}
                  className="min-w-[3.5rem] w-14 min-h-[3.5rem] h-14"
                />
                <div className="flex flex-col">
                  <p className="ml-2 text-gray-600 font-semibold dark:text-textLighter">
                    {user.firstName + " " + user.lastName}
                  </p>
                  <p className="ml-2 font-light text-sm text-gray-400 dark:text-textLight">
                    @{user.username}
                  </p>
                </div>
              </Link>
            ))}
          {results.posts.length > 0 && (
            <p className="text-gray-400 font-semibold text-base dark:text-textLighter">
              POSTS
            </p>
          )}
          {results.posts.length > 0 &&
            results.posts.map((post) => (
              <Link
                to={`/post/${post._id}`}
                className="flex font-semibold my-2 pt-2"
                key={post._id}
                onClick={() => setQuery("")}
              >
                <UserImage
                  src={post.userPicture}
                  username={post.username}
                  className="min-w-[3.5rem] w-14 min-h-[3.5rem] h-14"
                />
                <div className="flex flex-col">
                  <p className="ml-2 text-gray-600 font-semibold dark:text-textLighter">
                    {post.firstName + " " + post.lastName}
                  </p>
                  <p className="ml-2 font-light text-sm text-gray-400">
                    @{post.username}
                  </p>
                  <p className="ml-2 font-light text-sm text-gray-800 dark:text-textLighter">
                    <span className="font-semibold">
                      {post.description.length > 25
                        ? `${post.description.slice(0, 45)}...`
                        : post.description}
                    </span>
                  </p>
                </div>
              </Link>
            ))}
          {results.users.length === 0 && results.posts.length === 0 && (
            <p className="text-center font-semibold p-4 dark:text-textLighter">
              We didn't find <span className="text-sky-600">{`${query}`}</span>
            </p>
          )}
        </div>
      );
    }
  }, [loading, query, results]);

  return (
    <header
      className={
        navIsSticky
          ? "sticky-nav bg-white border-b-2 dark:bg-primarylessDark dark:border-b-primarylessDarker z-50"
          : "relative bg-white border-b-2 dark:bg-primarylessDark dark:border-b-primarylessDarker z-50"
      }
    >
      {!user ? (
        <div className="flex justify-center items-center py-5">
          <Link className="font-bold text-4xl text-sky-500" to="/">
            Socio
          </Link>
        </div>
      ) : (
        <div className="mx-auto px-4 sm:px-10 md:px-10 py-5 flex items-center">
          <div className="md:w-48 flex-shrink-0 mr-auto">
            <Link className="font-bold text-4xl text-sky-500" to="/">
              Socio
            </Link>
          </div>
          <div className="w-full mr-auto max-w-xs xl:max-w-lg 2xl:max-w-2xl bg-gray-100 rounded-md hidden lg:flex items-center">
            <form className="flex items-center w-full">
              <label className="sr-only">Search</label>
              <div className="relative w-full dark:bg-primarylessDarker">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <BsSearch className="w-4 h-4 text-gray-500 dark:textLighter" />
                </div>

                <input
                  type="text"
                  className="bg-gray-200 border-none outline-none appearance-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full pl-10 p-2.5  dark:bg-primarylessDarker dark:placeholder-gray-400 dark:text-white dark:focus:ring-sky-500 dark:focus:border-sky-500 focus:bg-gray-50"
                  placeholder="Search..."
                  required
                  onChange={(e) => setQuery(e.target.value)}
                />
                {renderSearchResults()}
              </div>
            </form>
          </div>
          <nav className="contents">
            <ul className="ml-4 xl:w-48 flex items-center gap-2 justify-end">
              <li className="relative inline-block ml-2 lg:ml-4 translate-y-1">
                <button onClick={handleModeToggle}>
                  {mode === "dark" ? (
                    <FaSun className="text-2xl text-gray-700 dark:text-gray-200" />
                  ) : (
                    <FaMoon className="text-2xl text-gray-700 dark:text-gray-200" />
                  )}
                </button>
              </li>
              <li className="ml-2 lg:ml-4 relative inline-block">
                <Link to="/chats">
                  <AiFillMessage className="text-2xl text-gray-700 dark:text-gray-200" />
                </Link>
              </li>
              <li className="ml-2 lg:ml-4 relative inline-block">
                <div className="absolute -top-2 -right-1 bg-sky-500 text-xs font-bold px-1 py-0.5 rounded-lg text-white">
                  {notifications.filter((obj) => obj.isRead !== true).length}
                </div>
                <div onClick={() => setIsOpen((prev) => !prev)}>
                  <IoIosNotifications className="text-3xl text-gray-700 cursor-pointer dark:text-gray-200" />
                </div>
                <Notifications
                  notifications={notifications}
                  isOpen={isOpen}
                  setIsOpen={setIsOpen}
                  setNotifications={setNotifications}
                />
              </li>
            </ul>
          </nav>
          <div className="ml-8 hidden sm:flex flex-col font-bold">
            <div className="relative overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
              <UserImage
                className="min-w-[2.5rem] w-10 min-h-[2.5rem] h-10"
                src={user.userPicture}
                username={user.username}
                link={true}
              />
            </div>
          </div>
          <button
            className="md:mr-5 lg:hidden ml-auto mr-0 flex items-center gap-2 text-gray-600 dark:text-textLight"
            onClick={handleSidebar}
          >
            <span className="text-2xl">
              {sideOpen ? <MdClose /> : <FiMenu />}
            </span>
            <span className="text-lg font-semibold hidden md:inline-block">
              Menu
            </span>
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
