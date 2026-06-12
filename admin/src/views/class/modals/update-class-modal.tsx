import { useFormik } from "formik";
import * as Yup from "yup";
import CustomModal from "../../../components/common/custom-modal";
import CustomInput from "../../../components/common/custom-input";
import CustomTextarea from "../../../components/common/custom-textarea";
import CustomSelect from "../../../components/common/custom-select";
import CustomButton from "../../../components/common/custom-button";
import { toast } from "react-toastify";
import { useUpdateClass } from "../../../queries/class.query";
import ClassApi from "../../../api/class-api";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAllMajors } from "../../../queries/major.query";

export default function UpdateClassModal({
  open,
  onClose,
  classId,
}: {
  open: boolean;
  onClose: () => void;
  classId: number | null;
}) {
  const { mutate, isPending } = useUpdateClass();
  const { majors } = useAllMajors();
  
  const { data: classData } = useQuery({
    queryKey: ["class", classId],
    queryFn: () => (classId ? ClassApi.getById(classId) : null),
    enabled: !!classId,
  });

  const formik = useFormik({
    initialValues: {
      major_id: "",
      code: "",
      name: "",
      description: "",
    },
    validationSchema: Yup.object({
      major_id: Yup.string().required("Vui lòng chọn hệ"),
      code: Yup.string().required("Vui lòng nhập mã lớp"),
      name: Yup.string().required("Vui lòng nhập tên lớp"),
    }),
    onSubmit: (values) => {
      if (!classId) return;
      mutate(
        { id: classId, data: { ...values, major_id: Number(values.major_id) } },
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
    if (classData && classId) {
      const item = classData?.data?.data;
      if (item) {
        formik.setValues({
          major_id: String(item.major_id),
          code: item.code,
          name: item.name,
          description: item.description || "",
        });
      }
    }
  }, [classData, classId]);

  return (
    <CustomModal
      onClose={() => {
        formik.resetForm();
        onClose();
      }}
      open={open}
      title="Cập nhật lớp học"
    >
      <form onSubmit={formik.handleSubmit}>
      <div className="flex flex-col gap-6 pt-3">
        <CustomSelect
          label="Thuộc hệ"
          name="major_id"
          value={formik.values.major_id}
          onChange={formik.handleChange}
          error={formik.touched.major_id ? formik.errors.major_id : undefined}
          required
          labelType="top"
          options={majors?.map(m => ({ label: m.name, value: String(m.id) })) || []}
        />
        <CustomInput
          label="Mã lớp"
          name="code"
          value={formik.values.code}
          onChange={formik.handleChange}
          error={formik.touched.code ? formik.errors.code : undefined}
          required
          disabled
          labelType="top"
        />
        <CustomInput
          label="Tên lớp"
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
        <CustomButton type="submit" label="Lưu thay đổi" size="sm" isLoading={isPending} />
      </div>
      </form>
    </CustomModal>
  );
}
