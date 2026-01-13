import CustomInput from "../components/common/custom-input";
import CustomTextarea from "../components/common/custom-textarea";

export default function ReceiverInfo() {
  return (
    <>
      <h5 className="pb border-b border-gray-300 text-sm">
        Thông tin người nhận
      </h5>

      <CustomInput required label="Tên Người/ Đơn vị nhận" labelType="top" />
      <CustomInput required label="Số điện thoại" labelType="top" />
      <CustomTextarea required label="Địa chỉ" labelType="top" />
    </>
  );
}
