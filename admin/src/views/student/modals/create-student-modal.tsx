import { useFormik } from "formik";
import * as Yup from "yup";
import CustomModal from "../../../components/common/custom-modal";
import CustomInput from "../../../components/common/custom-input";
import CustomSelect from "../../../components/common/custom-select";
import CustomButton from "../../../components/common/custom-button";
import { toast } from "react-toastify";
import { useCreateStudent } from "../../../queries/student.query";
import { useAllClasses } from "../../../queries/class.query";

export default function CreateStudentModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { mutate, isPending } = useCreateStudent();
  const { classes } = useAllClasses();
  
  const formik = useFormik({
    initialValues: {
      class_id: "",
      student_code: "",
      fullname: "",
      email: "",
      phone_number: "",
    },
    validationSchema: Yup.object({
      class_id: Yup.string().required("Vui lòng chọn lớp"),
      student_code: Yup.string().required("Vui lòng nhập mã học viên"),
      fullname: Yup.string().required("Vui lòng nhập tên học viên"),
      email: Yup.string().email("Email không hợp lệ").required("Vui lòng nhập email"),
    }),
    onSubmit: (values) => {
      mutate({
        ...values,
        class_id: Number(values.class_id),
      }, {
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
      title="Thêm học viên mới"
    >
      <form onSubmit={formik.handleSubmit}>
      <div className="flex flex-col gap-6 pt-3">
        <CustomSelect
          label="Thuộc lớp"
          name="class_id"
          value={formik.values.class_id}
          onChange={formik.handleChange}
          error={formik.touched.class_id ? formik.errors.class_id : undefined}
          required
          labelType="top"
          options={classes?.map(c => ({ label: c.name, value: String(c.id) })) || []}
        />
        <CustomInput
          label="Mã học viên"
          name="student_code"
          value={formik.values.student_code}
          onChange={formik.handleChange}
          error={formik.touched.student_code ? formik.errors.student_code : undefined}
          required
          labelType="top"
        />
        <CustomInput
          label="Họ và tên"
          name="fullname"
          value={formik.values.fullname}
          onChange={formik.handleChange}
          error={formik.touched.fullname ? formik.errors.fullname : undefined}
          required
          labelType="top"
        />
        <CustomInput
          label="Email"
          name="email"
          type="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          error={formik.touched.email ? formik.errors.email : undefined}
          required
          labelType="top"
        />
        <CustomInput
          label="Số điện thoại"
          name="phone_number"
          value={formik.values.phone_number}
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
