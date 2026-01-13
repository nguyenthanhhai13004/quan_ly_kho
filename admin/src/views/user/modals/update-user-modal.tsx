import { useForm } from "react-hook-form";
import CustomInput from "../../../components/common/custom-input";
import CustomModal, {
  type CustomModalProps,
} from "../../../components/common/custom-modal";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomSelect from "../../../components/common/custom-select";
import CustomButton from "../../../components/common/custom-button";
import { useModalProvider } from "../../../providers/modal-provider";
import { ModalEnum } from "../../../constants/modals.constant";
import { useEffect, useState } from "react";
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
import CustomCheckbox from "../../../components/common/custom-checkbox";

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
  const { setCurrentModal } = useModalProvider();
  const toggleWarehouse = (id: number) => {
    setWarehousesSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };
  const onSubmit = (data: UpdateUserData) => {
    if (!userId) return;
    mutate(
      {
        userId,
        updateUserDto: {
          active: data.active,
          email: data.email,
          fullname: data.fullname,
          phone_number:data.phone_number,
          warehouse_ids: warehousesSelected,
        },
        paginationDto: params,
      },
      {
        onSuccess: () => {
          setCurrentModal(ModalEnum.CLOSE_MODAL);
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
        phone_number:user.phone_number || ""
      });
      setWarehousesSelected(user.warehouse_ids || []);
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
