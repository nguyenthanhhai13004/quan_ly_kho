import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateUserDto } from "../dtos/user/create-user.dto";
import type { PaginationUsersDto } from "../dtos/user/pagination-users.dto";
import UserApi from "../api/user-api";
import { toast } from "react-toastify";
import type { UpdateUserDto } from "../dtos/user/update-user.dto";

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

export function useUser(userId:number) {
  const query = useQuery({
    queryKey: ["user",userId],
    queryFn: async () => {
      const res = await UserApi.getDetailUser(userId);
      return res.data;
    },
    retry: 1,
    enabled: !!userId
  });

  return {
    user: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

export function useUsers(paginationDto?: PaginationUsersDto) {
  const query = useQuery({
    queryKey: ["users",paginationDto],
    queryFn: async () => {
      const res = await UserApi.getAllUsers(paginationDto || {});
      return res.data;
    },
    retry: 1,
  });

  return {
    users: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}