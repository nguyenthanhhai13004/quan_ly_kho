import { IoIosSearch } from "react-icons/io";
import CustomButton from "../../components/common/custom-button";
import CustomInput from "../../components/common/custom-input";
import CustomSelect from "../../components/common/custom-select";
import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import { useUsers } from "../../hooks/user/use-users";
export const transactionTypes = [
  {
    type_code: "GD001",
    type_name: "Nhập",
    description: "Giao dịch nhập tài sản vào kho quân nhu."
  },
  {
    type_code: "GD002",
    type_name: "Xuất",
    description: "Giao dịch xuất tài sản ra khỏi kho.",
  },
  {
    type_code: "GD003",
    type_name: "Cấp phát",
    description: "Cấp phát tài sản cho đơn vị hoặc cá nhân sử dụng.",
  },
  {
    type_code: "GD004",
    type_name: "Thu hồi",
    description: "Thu hồi tài sản từ đơn vị hoặc cá nhân sau khi sử dụng.",
  },
  {
    type_code: "GD005",
    type_name: "Thanh lý",
    description: "Loại bỏ tài sản hỏng hoặc không còn giá trị sử dụng.",
  },
];

const assetStatus = [
  {
    label:"Tốt",
    value:""
  },
  {
    label:"Cần bảo trì",
    value:""
  },
  {
    label:"Lỗi / Hết hạn",
    value:""
  },
  {
    label:"Thanh lý",
    value:""
  }
]
export default function WarehouseFilter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const {users} = useUsers();
  const [filters, setFilters] = useState({
    role: "",
    active: "",
    keyword: "",
  });

  const handleChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    const params: any = {};
    if (filters.role) params.role = filters.role;
    if (filters.active) params.active = filters.active;
    if (filters.keyword) params.keyword = filters.keyword;
    params.page = "1";
    setSearchParams(params);
  };
  return (
    <div className="flex flex-wrap gap-2 items-center">
      <CustomSelect
        placeholder="Tất cả"
        labelType="top"
        className="min-w-[150px] rounded-2xl"
        options={transactionTypes.map((c)=>{
            return {
                label:c.type_name,
                value:c.type_code
            }
        })}
        value={filters.role}
        onChange={(e) => handleChange("role", e.target.value)}
        label="Loại giao dịch"
      />
      <CustomInput type="date" label="Từ ngày" labelType="top"/>
      <CustomInput type="date" label="Đến ngày" labelType="top"/>
      <CustomSelect
        labelType="top"
        placeholder="Tất cả"
        className="min-w-[150px] rounded-2xl"
        options={assetStatus}
        label="Tình trạng"
        value={filters.active}
        onChange={(e) => handleChange("active", e.target.value)}
      />
      <CustomSelect
        labelType="top"
        placeholder="Tất cả"
        className="min-w-[150px] rounded-2xl"
        options={users?.items.map((u)=>{return{
          label:u.fullname,
          value:u.id
        }})||[]}
        label="Người thực hiện"
        value={filters.active}
        onChange={(e) => handleChange("active", e.target.value)}
      />
      <CustomInput
        placeholder="Mã tài sản"
        value={filters.keyword}
        onChange={(e) => handleChange("keyword", e.target.value)}
      />
      <CustomButton
        size="sm"
        label="Tìm kiếm"
        className="h-full"
        onClick={handleSearch}
        icon={<IoIosSearch size={20} />}
      />
    </div>
  );
}
