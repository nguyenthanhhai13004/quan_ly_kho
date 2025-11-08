import { WAREHOUSE_CURRENT_COOKIE } from "../../constants/cookies.constant";
import { removeTokens } from "../../utils/storage"
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

export function useLogout(){
    const navigate = useNavigate();
    const logout = () => {
        removeTokens();
        Cookies.remove(WAREHOUSE_CURRENT_COOKIE);
        navigate("/login", { replace: true });
    }
    return {logout}
}