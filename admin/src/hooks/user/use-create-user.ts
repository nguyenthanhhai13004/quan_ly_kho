import { useMutation, useQueryClient } from "@tanstack/react-query";
import UserApi from "../../api/user-api";
import { toast } from "react-toastify";
import type { CreateUserDto } from "../../dtos/user/create-user.dto";
import type { PaginationUsersDto } from "../../dtos/user/pagination-users.dto";

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      createUserDto,
    }: {
      createUserDto: CreateUserDto;
      paginationDto?: PaginationUsersDto;
    }) => {
      return await UserApi.addNewUser(createUserDto);
    },
    onSuccess: ({ data, message }, variables) => {
      const { paginationDto } = variables;
      queryClient.setQueryData(["users",{...paginationDto,page:1}], (oldData: any) => {
        if (!oldData) return;
        return {
          ...oldData,
          items: [data,...oldData?.items]
        };
      });
      toast.info(message, {
        progress: undefined,
        hideProgressBar: true,
        autoClose: 1000,
      });
    },
    onError: (error: any) => {
      console.error(error.response?.data || error.message);
    },
  });
}
