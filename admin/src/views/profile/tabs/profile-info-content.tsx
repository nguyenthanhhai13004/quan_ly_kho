import { BiUser } from "react-icons/bi";
import CustomInfoTable from "../../../components/common/custom-info-table";
import { useMe } from "../../../hooks/auth/use-me";
import CustomButton from "../../../components/common/custom-button";

export default function ProfileInfoContent() {
  const { user, isLoading } = useMe();
  if (isLoading || !user) {
    return <p>Loading</p>;
  }
  return (
    <div className="w-[800px]  p-3 border border-gray-300">
      <div className="grid grid-cols-3 mb-3">
        <div className="col-span-1">
          <div className="h-30 w-30 rounded-full flex items-center justify-center bg-white border-2 border-gray-300 mx-auto">
            <BiUser className="text-gray-400" size={100} />
          </div>
        </div>
        <div className="col-span-2">
          <CustomInfoTable
            data={[
              {
                label: "Tên đăng nhập",
                value: user.username,
              },
              {
                label: "Họ tên",
                value: user.fullname,
              },
              {
                label: "Email",
                value: user.email,
              },
              {
                label: "Vai trò",
                value: user.role,
              },
            ]}
          />
        </div>
      </div>
      <div className="text-right">
      <CustomButton label="Chỉnh sửa thông tin" size="sm"/>
      </div>
    </div>
  );
}
