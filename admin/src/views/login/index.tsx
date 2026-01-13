import { BiKey, BiUser } from "react-icons/bi";
import CustomButton from "../../components/common/custom-button";
import CustomInput from "../../components/common/custom-input";
import { CgPassword } from "react-icons/cg";
import { useForm } from "react-hook-form";
import { LoginSchema, type LoginFormData } from "../../dtos/auth/login.dto";
import { zodResolver } from "@hookform/resolvers/zod";
import { AiOutlineAppstore } from "react-icons/ai";
import { useLogin } from "../../queries/auth.query";
import CustomInputPw from "../../components/common/custom-input-pw";
import { Link } from "react-router-dom";

export default function LoginView() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
  });

  const { mutate } = useLogin();

  const onSubmit = (data: LoginFormData) => {
    mutate(data);
  };

  return (
    <div className="w-full h-screen bg-[#d0d8dc] p-[50px]">
      {/* LEFT BANNER */}
      <div className="w-full h-full grid grid-cols-1 rounded-2xl overflow-hidden md:grid-cols-2 bg-white">
        <div className="hidden md:block">
          <img
            src="https://mavachvietnam.vn/wp-content/uploads/2025/02/he-thong-quan-ly-kho-hang-wms-la-gi.jpg"
            alt="Banner"
            className="w-full h-full object-cover"
          />
        </div>

        {/* RIGHT FORM */}
        <div className="flex justify-center items-center p-4">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="w-[350px] p-5">
              <div className="mb-5">
                <AiOutlineAppstore
                  className="mx-auto font-semibold text-gray-700"
                  size={40}
                />
                <h5 className="mb-3 text-center text-2xl font-semibold text-gray-800">
                  WMS
                </h5>
              </div>

              <div className="mb-3">
                <CustomInput
                  {...register("username")}
                  error={errors.username?.message}
                  placeholder="Tên đăng nhập"
                  icon={<BiUser />}
                />
              </div>

              <div className="mb-3">
                {/* <CustomInput
                  {...register("password")}
                  error={errors.password?.message}
                  placeholder="Mật khẩu"
                  type="password"
                  icon={<CgPassword />}
                /> */}
                <CustomInputPw
                  {...register("password")}
                  error={errors.password?.message}
                  placeholder="Mật khẩu"
                  type="password"
                />
              </div>

              <CustomButton
                type="submit"
                label="Đăng nhập"
                className="px-3 py-3 w-full uppercase"
                variant="info"
              />

               <Link className="text-blue-500 my-3 block" to={"/reset-pw"}>
                  <p className="text-end">Quên mật khẩu</p>
                </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
