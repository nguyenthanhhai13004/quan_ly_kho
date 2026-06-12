import { useFormik } from "formik";
import * as Yup from "yup";
import CustomModal from "../../../components/common/custom-modal";
import CustomInput from "../../../components/common/custom-input";
import CustomSelect from "../../../components/common/custom-select";
import CustomButton from "../../../components/common/custom-button";
import { toast } from "react-toastify";
import { useUpdateStudent } from "../../../queries/student.query";
import StudentApi from "../../../api/student-api";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAllClasses } from "../../../queries/class.query";

import { useMe } from "../../../queries/auth.query";

export default function UpdateStudentModal({
  open,
  onClose,
  studentId,
}: {
  open: boolean;
  onClose: () => void;
  studentId: number | null;
}) {
  const { mutate, isPending } = useUpdateStudent();
  const { user } = useMe();
  const isCommander = user?.role === "commander";
  const { classes } = useAllClasses(undefined, { enabled: !isCommander });
  
  const { data: studentData } = useQuery({
    queryKey: ["student", studentId],
    queryFn: () => (studentId ? StudentApi.getById(studentId) : null), // Assuming getById exists, or we could fetch from list
    enabled: !!studentId,
  });

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
      if (!studentId) return;
      mutate(
        { id: studentId, data: { ...values, class_id: Number(values.class_id) } },
        {
          onSuccess: () => {
            toast.success("Cập nhật thành công");
            onClose();
          },
          onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra");
          },
        }
      );
    },
  });

  useEffect(() => {
    if (studentData && studentId) {
      // Need to adjust if the API returns { data: { metadata: ... } } structure
      const item = studentData?.data?.data;
      if (item) {
        formik.setValues({
          class_id: String(item.class_id),
          student_code: item.student_code,
          fullname: item.fullname,
          email: item.email,
          phone_number: item.phone_number || "",
        });
      }
    }
  }, [studentData, studentId]);

  return (
    <CustomModal
      onClose={() => {
        formik.resetForm();
        onClose();
      }}
      open={open}
      title="Cập nhật học viên"
    >
      <form onSubmit={formik.handleSubmit}>
      <div className="flex flex-col gap-6 pt-3">
        {!isCommander && (
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
        )}
        <CustomInput
          label="Mã học viên"
          name="student_code"
          value={formik.values.student_code}
          onChange={formik.handleChange}
          error={formik.touched.student_code ? formik.errors.student_code : undefined}
          required
          disabled
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
        <CustomButton type="submit" label="Lưu thay đổi" size="sm" isLoading={isPending} />
      </div>
      </form>
    </CustomModal>
  );
}
