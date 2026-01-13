import { IoIosSearch } from "react-icons/io";
import CustomButton from "../components/common/custom-button";
import { GrPowerReset } from "react-icons/gr";
type FilterWrapperProps = {
  children?: React.ReactNode;
  onSubmit?: () => void;
  onReset?: () => void;
};

export default function FilterWrapper({
  children,
  onSubmit,
  onReset,
}: FilterWrapperProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.();
  };

  const handleReset = () => {
    onReset?.();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-row gap-2 h-8 items-center"
    >
      {children}
      <CustomButton
        label="Tìm kiếm"
        className="h-full"
        type="submit"
        icon={<IoIosSearch size={20} />}
      />
      {onReset && (
        <CustomButton
          label="Đặt lại"
          className="h-full"
          type="button"
          onClick={handleReset}
          variant="danger"
          icon={<GrPowerReset size={20} />}
        />
      )}
    </form>
  );
}
