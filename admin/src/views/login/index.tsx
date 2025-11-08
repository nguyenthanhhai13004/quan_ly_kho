import { BiKey, BiUser } from "react-icons/bi";
import CustomButton from "../../components/common/custom-button";
import CustomInput from "../../components/common/custom-input";
import { CgPassword } from "react-icons/cg";
import { useForm } from "react-hook-form";
import { LoginSchema, type LoginFormData } from "../../dtos/auth/login.dto";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLogin } from "../../hooks/auth/use-login";
import { AiOutlineAppstore } from "react-icons/ai";

export default function LoginView() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
  });

  const { mutate, isPending, isError, error } = useLogin();

  const onSubmit = (data: LoginFormData) => {
    mutate(data);
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="w-[350px] mx-auto mt-10 p-5 bg-white rounded-xl border-2 border-gray-300 shadow-2xl">
          <h5 className="mb-3 text-center text-2xl font-semibold border-gray-300">
            Welcome
          </h5>
          <div className="mb-5">
            <AiOutlineAppstore className="mx-auto font-semibold" size={30} />
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
            <CustomInput
              {...register("password")}
              error={errors.password?.message}
              placeholder="Mật khẩu"
              type="password"
              icon={<CgPassword />}
            />
          </div>
          <CustomButton
            type="submit"
            label="Đăng nhập"
            className="px-3 py-3 w-full bg-linear-to-r from-[#29cefc] to-[#bc25ff] uppercase"
          />
        </div>
      </form>
    </div>
  );
}
