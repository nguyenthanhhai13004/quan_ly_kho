import { useMutation } from "@tanstack/react-query";
import AuthApi from "../../api/auth-api";
import { saveTokens } from "../../utils/storage";
import { useNavigate } from "react-router-dom";

export function useLogin() {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: AuthApi.login,
    onSuccess: ({ data, message, status }) => {
      const { tokens } = data;
      saveTokens(tokens);
      navigate("/", { replace: true });
    },
    onError: (error: any) => {
      console.error(
        error.response?.data || error.message,
      );
    },
  });
}
