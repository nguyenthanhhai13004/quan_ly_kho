import { useState } from "react";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import CustomInput from "./custom-input";

export default function CustomInputPw(props: any) {
  const [show, setShow] = useState(false);

  return (
    <CustomInput
      {...props}
      type={show ? "text" : "password"}
      icon={
        <div
          className="cursor-pointer"
          onClick={() => setShow(!show)}
        >
          {show ?  <IoIosEye size={20} /> : <IoIosEyeOff size={20} />}
        </div>
      }
    />
  );
}