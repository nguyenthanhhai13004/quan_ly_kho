import { useFormik } from "formik";
import * as Yup from "yup";
import CustomModal from "../../../components/common/custom-modal";
import CustomInput from "../../../components/common/custom-input";
import CustomTextarea from "../../../components/common/custom-textarea";
import CustomButton from "../../../components/common/custom-button";
import { toast } from "react-toastify";
import { useUpdateMajor } from "../../../queries/major.query";
import MajorApi from "../../../api/major-api";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

export default function UpdateMajorModal({
  open,
  onClose,
  majorId,
}: {
  open: boolean;
  onClose: () => void;
  majorId: number | null;
}) {
  const { mutate, isPending } = useUpdateMajor();
  
  const { data: majorData } = useQuery({
    queryKey: ["major", majorId],
    queryFn: () => (majorId ? MajorApi.getById(majorId) : null),
    enabled: !!majorId,
  });

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
      if (!majorId) return;
      mutate(
        { id: majorId, data: values },
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
    if (majorData && majorId) {
      const item = majorData?.data?.data;
      if (item) {
        formik.setValues({
          code: item.code,
          name: item.name,
          description: item.description || "",
        });
      }
    }
  }, [majorData, majorId]);

  return (
    <CustomModal
      onClose={() => {
        formik.resetForm();
        onClose();
      }}
      open={open}
      title="Cập nhật hệ"
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
          disabled
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
        <CustomButton type="submit" label="Lưu thay đổi" size="sm" isLoading={isPending} />
      </div>
      </form>
    </CustomModal>
  );
}
