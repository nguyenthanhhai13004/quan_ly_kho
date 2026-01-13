import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import AuthApi from "../api/auth-api";
import { getTokens, removeTokens, saveTokens } from "../utils/storage";
import Cookies from "js-cookie";
import { WAREHOUSE_CURRENT_COOKIE } from "../constants/cookies.constant";
import { RolesEnum } from "../common/enums/roles.enum";

export function useLogin() {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: AuthApi.login,
    onSuccess: ({ data, message, status }) => {
      const { tokens,user } = data;
      saveTokens(tokens);
      console.log("user.role",user)
      if (user.role == RolesEnum.ADMIN){
         navigate("/User/List", { replace: true });
      }
      else if (user.role == RolesEnum.USER){
         navigate("/Asset/Own", { replace: true });
      }else{
         navigate("/", { replace: true });
      }
     
    },
    onError: (error: any) => {
      console.error(
        error.response?.data || error.message,
      );
    },
  });
}

export function useResetPW() {
  return useMutation({
    mutationFn: AuthApi.resetPw,
  });
}

export function useLogout(){
    const logout = () => {
        removeTokens();
        Cookies.remove(WAREHOUSE_CURRENT_COOKIE);
        Cookies.remove("wh-selected-name")
        window.location.href = "/login";  
    }
    return {logout}
}

export function useMe() {
  const query = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await AuthApi.me();
      return {
        ...res.data,
        "warehouse_ids":[1,2,3,4,5]
      };
    },
    enabled: !!getTokens(),
  });

  return {
    user: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
