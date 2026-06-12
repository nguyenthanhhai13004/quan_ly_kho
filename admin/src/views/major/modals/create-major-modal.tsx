import { useFormik } from "formik";
import * as Yup from "yup";
import CustomModal from "../../../components/common/custom-modal";
import CustomInput from "../../../components/common/custom-input";
import CustomTextarea from "../../../components/common/custom-textarea";
import CustomButton from "../../../components/common/custom-button";
import { toast } from "react-toastify";
import { useCreateMajor } from "../../../queries/major.query";

export default function CreateMajorModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { mutate, isPending } = useCreateMajor();
  
  const formik = useFormik({
    initialValues: {
      code: "",
      name: "",
      description: "",
    },
    validationSchema: Yup.object({
      code: Yup.string().required("Vui lòng nhập mã hệ"),
      name: Yup.string().required("Vui lòng nhập tên hệ"),
    }),
    onSubmit: (values) => {
      mutate(values, {
        onSuccess: () => {
          toast.success("Tạo mới thành công");
          formik.resetForm();
          onClose();
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || "Có lỗi xảy ra");
        },
      });
    },
  });

  return (
    <CustomModal
      onClose={() => {
        formik.resetForm();
        onClose();
      }}
      open={open}
      title="Thêm hệ mới"
    >
      <form onSubmit={formik.handleSubmit}>
      <div className="flex flex-col gap-6 pt-3">
        <CustomInput
          label="Mã hệ"
          name="code"
          value={formik.values.code}
          onChange={formik.handleChange}
          error={formik.touched.code ? formik.errors.code : undefined}
          required
          labelType="top"
        />
        <CustomInput
          label="Tên hệ"
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          error={formik.touched.name ? formik.errors.name : undefined}
          required
          labelType="top"
        />
        <CustomTextarea
          label="Mô tả"
          name="description"
          value={formik.values.description}
          onChange={formik.handleChange}
          labelType="top"
        />
      </div>
      <div className="text-right mt-4">
        <CustomButton type="submit" label="Tạo mới" size="sm" isLoading={isPending} />
      </div>
      </form>
    </CustomModal>
  );
}
