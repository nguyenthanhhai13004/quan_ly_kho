import { useMutation, useQueryClient } from "@tanstack/react-query";
import UserApi from "../../api/user-api";
import type { UpdateUserDto } from "../../dtos/user/update-user.dto";
import type { PaginationUsersDto } from "../../dtos/user/pagination-users.dto";
import { toast } from "react-toastify";

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      userId,
      updateUserDto
    }: {
      userId: number;
      updateUserDto: UpdateUserDto;
      paginationDto?:PaginationUsersDto
    }) => {
      return await UserApi.updateUser(userId, updateUserDto);
    },
    onSuccess: ({ data},variables) => {
      const { paginationDto } = variables;
      queryClient.setQueryData(["users",paginationDto], (oldData: any) => {
        if (!oldData) return;
       return {
          ...oldData,
          items: oldData.items?.map((user: any) =>
            user.id === data.id ? { ...user, ...data } : user
          ),
        };
      });
      toast.info("Cập nhật người dùng thành công",{progress:undefined,hideProgressBar:true,autoClose:1000});
    },
    onError: (error: any) => {
      console.error(error.response?.data || error.message);
    },
  });
}
