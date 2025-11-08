import { useMe } from "../../hooks/auth/use-me";
import { IoPower } from "react-icons/io5";
import { BiUser } from "react-icons/bi";
import { useLogout } from "../../hooks/auth/use-logout";
import { BsReverseLayoutTextSidebarReverse } from "react-icons/bs";
import NavbarDrawer from "../../views/drawers/navbar-drawer";
import { useState } from "react";
import InfoModal from "../../views/modals/info-modal";
import { useModalProvider } from "../../providers/modal-provider";
import { ModalEnum } from "../../constants/modals.constant";
import ChangePasswordModal from "../../views/modals/change-password-modal";
import { PiPassword } from "react-icons/pi";


export default function CustomHeader() {
  const { user } = useMe();
  const { logout } = useLogout();
  const [isOpenDrawer,setIsOpenDrawer] = useState(false);
  const {currentModal,setCurrentModal} = useModalProvider();
  return (
    <div className="w-full mb-5 flex">
      <div>
        <BsReverseLayoutTextSidebarReverse onClick={()=>setIsOpenDrawer(true)} className="cursor-pointer lg:hidden" size={20}/>
      </div>
      {user && (
        <div
          tabIndex={0}
          className="group flex items-center justify-center relative cursor-pointer h-10 w-10 bg-white rounded-full ml-auto border-2 border-gray-300"
        >
          <BiUser size={20}/>
          <div className="hidden z-10 px-2 rounded-xl mt-2 text-xs group-focus-within:block w-[170px] py-2 bg-white shadow-2xl border border-gray-300 absolute top-full right-0">
            <div onClick={()=>setCurrentModal(ModalEnum.PROFILE_MODAL)} className="hover:bg-gray-300 rounded">
              <button
                className="flex items-center gap-2 px-2 py-1 cursor-pointer"
              >
                <BiUser size={20} />
                <span>Thông tin cá nhân</span>
              </button>
            </div>
             <div onClick={()=>setCurrentModal(ModalEnum.CHANGE_PASSWORD)} className="hover:bg-gray-300 rounded">
              <button
                className="flex items-center gap-2 px-2 py-1 cursor-pointer"
              >
                <PiPassword size={20} />
                <span>Mật khẩu</span>
              </button>
            </div>
            <div className="border-b border-gray-300 my-1"></div>
            <div className="hover:bg-gray-300 rounded">
              <div
                onClick={logout}
                className="flex items-center gap-2 px-2 py-1"
              >
                <IoPower size={20} />
                <span>Đăng xuất</span>
              </div>
            </div>
          </div>
        </div>
      )}
      <NavbarDrawer onClose={()=>setIsOpenDrawer(false)} open={isOpenDrawer}/>
      <InfoModal open={currentModal === ModalEnum.PROFILE_MODAL} onClose={()=>setCurrentModal(ModalEnum.CLOSE_MODAL)}/>
      <ChangePasswordModal open={currentModal === ModalEnum.CHANGE_PASSWORD} onClose={()=>setCurrentModal(ModalEnum.CLOSE_MODAL)}/>
    </div>
  );
}
