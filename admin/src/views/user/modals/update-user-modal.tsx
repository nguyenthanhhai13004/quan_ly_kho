import { useForm } from "react-hook-form";
import CustomInput from "../../../components/common/custom-input";
import CustomModal, {
  type CustomModalProps,
} from "../../../components/common/custom-modal";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomSelect from "../../../components/common/custom-select";
import CustomButton from "../../../components/common/custom-button";

import { useEffect, useRef, useState } from "react";
import {
  UpdateUserSchema,
  type UpdateUserData,
} from "../../../dtos/user/update-user.dto";
import { useUpdateUser, useUser } from "../../../queries/user.query";
import { usePaginationParams } from "../../../hooks/use-pagination-params";
import type { PaginationUsersDto } from "../../../dtos/user/pagination-users.dto";
import { useAllRoles } from "../../../queries/rbac.query";
import { IoMdSearch } from "react-icons/io";
import { useWarehouseAny } from "../../../queries/warehouse.query";
import { useAllClasses } from "../../../queries/class.query";
import { useAllMajors } from "../../../queries/major.query";
import CustomCheckbox from "../../../components/common/custom-checkbox";
import { FiCamera } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
import { toast } from "react-toastify";

interface UpdateUserModalProps extends CustomModalProps {
  userId: number | null;
}

export default function UpdateUserModal({
  open,
  onClose,
  userId,
}: UpdateUserModalProps) {
  const { roles } = useAllRoles();
  const { user } = useUser(userId || 0);
  // const { classes } = useAllClasses();
  const { majors } = useAllMajors();
  const { params } = usePaginationParams<PaginationUsersDto>();
  const [warehousesSelected, setWarehousesSelected] = useState<number[]>([]);
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    getValues,
    watch,
  } = useForm<UpdateUserData>({
    resolver: zodResolver(UpdateUserSchema),
  });
  const { mutate } = useUpdateUser();
  const [inputKeyword, setInputKeyword] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const { warehouses } = useWarehouseAny(searchKeyword);

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleWarehouse = (id: number) => {
    setWarehousesSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };
  const { classes } = useAllClasses();

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: UpdateUserData) => {
    if (!userId) return;
    if (data.role_id === 3 && warehousesSelected.length === 0) {
      toast.error("Vui lòng chọn kho quản lý cho chỉ huy");
      return;
    }
    mutate(
      {
        userId,
        updateUserDto: {
          active: data.active,
          email: data.email,
          fullname: data.fullname,
          phone_number:data.phone_number,
          warehouse_ids: warehousesSelected,
          class_id: null,
          major_id: data.role_id === 3 ? data.major_id : null,
          avatar: avatarFile,
        },
        paginationDto: params,
      },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  useEffect(() => {
    if (user) {
      reset({
        email: user.email || "",
        fullname: user.fullname || "",
        username: user.username || "",
        role_id: user.role,
        active: user.is_active,
        phone_number:user.phone_number || "",
        class_id: user.class_id,
        major_id: user.major_id,
      });
      setWarehousesSelected(user.warehouse_ids || []);
      // Set existing avatar preview
      if (user.avatar_url) {
        setAvatarPreview(`${import.meta.env.VITE_API_URL}${user.avatar_url}`);
      } else {
        setAvatarPreview(null);
      }
      setAvatarFile(null);
    }
  }, [user, reset]);

  return (
    <CustomModal
      width="max-w-5xl"
      title="Cập nhật người dùng"
      onClose={onClose}
      open={open}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Avatar Upload */}
        <div className="flex justify-center mb-4 pt-3">
          <div className="relative">
            <div
              className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-blue-400 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <FaUserCircle className="text-gray-300" size={64} />
              )}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-1.5 shadow-md transition-colors"
            >
              <FiCamera size={14} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>
        </div>
        <p className="text-center text-xs text-gray-400 mb-3">Nhấn để thay đổi ảnh đại diện</p>

        <div className="grid grid-cols-3 gap-2 pb-1 border-b mb-2 border-gray-300 pt-3">
          <div className="mb-3">
            <CustomInput
              labelType="top"
              required
              {...register("username")}
              error={errors.username?.message}
              placeholder="abcefd"
              disabled
              label="Tên đăng nhập"
            />
          </div>
          <div className="mb-3">
            <CustomInput
              labelType="top"
              required
              {...register("email")}
              error={errors.email?.message}
              placeholder="user@example.com"
              label="Email"
            />
          </div>
          <div className="mb-3">
            <CustomInput
              labelType="top"
              required
              {...register("fullname")}
              error={errors.fullname?.message}
              placeholder="Nguyen Van A"
              label="Họ tên"
            />
          </div>
          <div className="mb-5">
            <div className="grid grid-cols-2 gap-2">
              <CustomInput
                labelType="top"
                {...register("phone_number")}
                error={errors.phone_number?.message}
                placeholder="099999xxxx"
                label="Số điện thoại"
              />
              <CustomSelect
                register={register("role_id", {
                  required: true,
                  valueAsNumber: true,
                })}
                error={errors.role_id?.message}
                labelType="top"
                label="Quyền"
                disabled
                options={
                  roles?.map((r) => ({ label: r.name, value: r.id })) || []
                }
              />
            </div>
          </div>
        </div>
        {watch("role_id") == 3 && (
          <div className="mb-5 grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-bold mb-3">Chọn hệ quản lý</h4>
              <div className="w-[300px]">
                <CustomSelect
                  register={register("major_id", {
                    valueAsNumber: true,
                  })}
                  labelType="top"
                  label="Hệ quản lý"
                  options={
                    majors?.map((m) => ({ label: m.name, value: m.id })) || []
                  }
                />
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-3">Chọn kho quản lý</h4>
              <div className="w-[300px]">
                <CustomSelect
                  labelType="top"
                  label="Kho quản lý"
                  placeholder="Chọn kho..."
                  required
                  value={warehousesSelected[0] || ""}
                  onChange={(e) => setWarehousesSelected(e.target.value ? [Number(e.target.value)] : [])}
                  options={
                    warehouses?.items.map((w: any) => ({ label: w.name, value: w.id })) || []
                  }
                />
              </div>
            </div>
          </div>
        )}
        {watch("role_id") == 2 && (
          <div className="mb-5">
            <h4 className="font-bold mb-3">Chọn kho quản lý</h4>
            <div className="w-[250px] mb-3">
              <CustomInput
                value={inputKeyword}
                onChange={(e) => setInputKeyword(e.target.value)}
                icon={
                  <IoMdSearch
                    size={20}
                    className="cursor-pointer"
                    onClick={() => setSearchKeyword(inputKeyword)}
                  />
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    setSearchKeyword(inputKeyword);
                  }
                }}
                placeholder="Tìm kho ..."
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {warehouses?.items.map((w:any, index) => (
                <div key={index}>
                  <CustomCheckbox
                    checked={warehousesSelected.includes(w.id)}
                    onChange={() => toggleWarehouse(w.id)}
                    value={w.id}
                    label={
                      <div className="text-xs p-2 rounded shadow-2xl bg-white">
                        <h5 className="font-bold">
                          [{w.code}] {w.name}
                        </h5>
                        <p className="font-thin">{w?.address_detail}</p>
                      </div>
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="text-right">
          <CustomButton type="submit" label="Cập nhật" size="sm" />
        </div>
      </form>
    </CustomModal>
  );
}
