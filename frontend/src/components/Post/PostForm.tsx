import { useState } from "react";
import { useSelector } from 'react-redux';
import { BsImage } from "react-icons/bs";
import { MdOutlineClose } from "react-icons/md";
import { selectUser } from '../../store/slices/authSlice';
import Card from "../../ui/Card";
import Button from "../../ui/Button";

const PostForm: React.FC = () => {
  const user = useSelector(selectUser);

  const [text, setText] = useState("");
  const [image, setImage] = useState<object>();
  const [previewImage, setPreviewImage] = useState<string>("");

  const changeHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const uploadImageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0];
    setImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const removeImageHandler = () => {
    setImage({});
    setPreviewImage("");
  };

  const submitHandler = () => {
    console.log(image);
    console.log(user)
  };

  return (
    <Card>
      <div className="mb-8 mx-10 py-6 flex flex-col items-center lg:items-start lg:flex-row gap-4">
        <img className="w-14 h-14 rounded-full shadow-lg" src={user!.userPicture} alt={`${user!.firstName} ${user!.lastName}'s profile picture`} />
        <div className="w-full flex flex-col items-center md:items-start gap-3">
          <textarea
            className="w-full min-h-[6rem] h-fit max-h-[14rem] resize-y pl-4 pr-7 py-1.5 border rounded-xl outline-none"
            placeholder="Share something.."
            value={text}
            onChange={changeHandler}
          />
          <div className="w-full flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-fit flex flex-row items-center gap-1 border rounded-xl px-5 py-2 cursor-pointer transition duration-500 hover:text-white hover:bg-sky-500">
              <BsImage />
              <span className="text-sm font-semibold tracking-wide">Photo</span>
              <input className="absolute top-0 right-0 w-full h-full opacity-0" type="file" value="" onChange={uploadImageHandler} />
            </div>
            <div className="">
              <Button text="Submit" bg={true} onClick={submitHandler} className="!px-10 !py-1.5" />
            </div>
          </div>
            {
              previewImage &&
              <div className="relative sm:self-start rounded-lg overflow-hidden" onClick={removeImageHandler}>
                <div className="absolute top-0 left-0 w-full h-full flex flex-row items-center justify-center grow opacity-0 transition duration-500 hover:opacity-100">
                  <MdOutlineClose className="text-3xl text-white z-50" />
                  <div className="absolute w-full h-full bg-black bg-opacity-20"></div>
                </div>
                <img className="w-16 h-16" src={previewImage} alt="" />
              </div>
            }
        </div>
      </div>
    </Card>
  );
};

export default PostForm;
