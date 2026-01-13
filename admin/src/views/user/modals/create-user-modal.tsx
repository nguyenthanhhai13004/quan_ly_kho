import { useForm } from "react-hook-form";
import CustomInput from "../../../components/common/custom-input";
import CustomModal, {
  type CustomModalProps,
} from "../../../components/common/custom-modal";
import {
  CreateUserSchema,
  type CreateUserData,
} from "../../../dtos/user/create-user.dto";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomSelect from "../../../components/common/custom-select";
import CustomButton from "../../../components/common/custom-button";
import { useModalProvider } from "../../../providers/modal-provider";
import { ModalEnum } from "../../../constants/modals.constant";
import { usePaginationParams } from "../../../hooks/use-pagination-params";
import type { PaginationUsersDto } from "../../../dtos/user/pagination-users.dto";
import { useState } from "react";
import { useCreateUser } from "../../../queries/user.query";
import { useWarehouseAny } from "../../../queries/warehouse.query";
import { useAllRoles } from "../../../queries/rbac.query";
import CustomCheckbox from "../../../components/common/custom-checkbox";
import { IoMdSearch } from "react-icons/io";
export default function CreateUserModal({ open, onClose }: CustomModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<CreateUserData>({
    resolver: zodResolver(CreateUserSchema),
  });
  const { roles } = useAllRoles();
  const { mutate } = useCreateUser();
  const { setCurrentModal } = useModalProvider();
  const { params } = usePaginationParams<PaginationUsersDto>();
  const [warehousesSelected, setWarehousesSelected] = useState<number[]>([]);
  const [inputKeyword, setInputKeyword] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");

  const { warehouses } = useWarehouseAny(searchKeyword);
  const toggleWarehouse = (id: number) => {
    setWarehousesSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };
  const onSubmit = (data: CreateUserData) => {
    const createUserDto = {
      email: data.email,
      fullname: data.fullname,
      username: data.username,
      role_id: data.role_id,
      warehouse_ids: warehousesSelected,
      phone_number: data.phone_number,
    };
    mutate(
      {
        createUserDto,
        paginationDto: params,
      },
      {
        onSuccess: () => {
          setCurrentModal(ModalEnum.CLOSE_MODAL);
          setWarehousesSelected([]);
          reset();
        },
      },
    );
  };
  return (
    <CustomModal
      width="max-w-5xl"
      title="Tạo người dùng"
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
            <div className="grid grid-cols-2 gap-2 items-start">
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
                required
                error={errors.role_id?.message}
                labelType="top"
                label="Quyền"
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
                        {/* <div className="mt-2">
                          <CustomButton variant="info" label="Xem chi tiết" size="xs" />
                        </div> */}
                      </div>
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="text-right">
          <CustomButton type="submit" label="Tạo mới" size="sm" />
        </div>
      </form>
    </CustomModal>
  );
}
