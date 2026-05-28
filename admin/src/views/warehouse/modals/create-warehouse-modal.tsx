import { useForm } from "react-hook-form";
import CustomButton from "../../../components/common/custom-button";
import CustomInput from "../../../components/common/custom-input";
import CustomModal, {
  type CustomModalProps,
} from "../../../components/common/custom-modal";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateWarehouse } from "../../../queries/warehouse.query";
import { toast } from "react-toastify";
import MapView from "../../map-view";
import CustomSelect from "../../../components/common/custom-select";
import CustomTextarea from "../../../components/common/custom-textarea";
import {
  useNominatimSearch,
} from "../../../queries/administrative.query";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ProvincesApi from "../../../api/provinces-api";
import WardsApi from "../../../api/wards-api";

const schema = z.object({
  name: z.string().min(1, "Tên kho không được để trống"),

  // province_code: z.string().min(1, "Vui lòng chọn tỉnh/thành"),
  // ward_code: z.string().min(1, "Vui lòng chọn phường/xã"),
  address_detail: z.string().min(1, "Địa chỉ không được để trống"),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
});

interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

export type FormType = z.infer<typeof schema>;

// export default function CreateWarehouseModal({
//   onClose,
//   open,
// }: CustomModalProps) {
//   const { handleSubmit, register, reset, watch, setValue, getValues } =
//     useForm<FormType>({
//       resolver: zodResolver(schema),
//       defaultValues: {
//         latitude: null,
//         longitude: null,
//       },
//     });
//   const [addressDetail, setAddressDetail] = useState("");
//   const [currentGeo, setCurrentGeo] = useState<NominatimResult | null>(null);
//   const [province, setProvince] = useState<string>("");
//   const {data:provinceData} = useQuery({
//     queryKey:["provinces"],
//     queryFn: ProvincesApi.getAll
//   })
//   const {data:wardData} = useQuery({
//     queryKey:["wards",province],
//     queryFn: ()=> WardsApi.getAll(province),
//     enabled: !!province
//   })
//   const { data } = useNominatimSearch(addressDetail);
//   const { mutate } = useCreateWarehouse();
//   const onSubmit = (data: FormType) => {
//     mutate({
//       ...data,
//       address_detail:currentGeo?.display_name
//     }, {
//       onSuccess: (res) => {
//         toast.success("Tạo kho thành công");
//         onClose();
//         reset();
//       },
//     });
//   };
//   return (
//     <CustomModal width="w-2xl" title="Tạo kho" open={open} onClose={onClose}>
//       <form onSubmit={handleSubmit(onSubmit)}>
//         <div className="grid grid-cols-3 gap-2 pb-1 border-b mb-2 border-gray-300 pt-3">
//           <div className="mb-3">
//             <CustomInput
//               label="Tên kho"
//               type="text"
//               labelType="top"
//               placeholder="Nhập tên kho"
//               required
//               {...register("name")}
//             />
//           </div>
//          <div className="mb-3">
//             <CustomSelect
//               label="Tỉnh/Thành Phố"
//               labelType="top"
//               className="w-full"
//               options={
//                 provinceData?.map((p: any) => ({
//                   value: p.code,
//                   label: p.name,
//                 })) || []
//               }
//               onChange={(e) => {
//                 // setValue("province_code", e.target.value);
//                 // setValue("ward_code", "");
//                 setProvince(e.target.value);
//               }}
//             />
//           </div>
//           <div className="mb-3">
//             <CustomSelect
//               label="Xã/Phường"
//               labelType="top"
//               className="w-full"
//               options={
//                 wardData?.map((w: any) => ({
//                   value: w.code,
//                   label: w.name,
//                 })) || []
//               }
//               // onChange={(e) => setValue("ward_code", e.target.value)}
//             />
//           </div> 
//           <div className="mb-3 flex gap-2 col-span-2">
//             <CustomInput
//               label="Địa chỉ cụ thể"
//               labelType="top"
//               placeholder="Nhập địa chỉ kho"
//               required
//               containerClassName="w-full"
//               {...register("address_detail")}
//             />
//             <CustomButton
//               type="button"
//               onClick={() => setAddressDetail(getValues("address_detail"))}
//               label="Tìm kiếm"
//             />
//           </div>
//         </div>

//         {
//           data && (
//             <div className="mb-3 border p-2 rounded border-gray-200">
//           {data.map((m: any) => (
//             <div
//               onClick={() => {
//                 setCurrentGeo(m);
//                 setValue("latitude", Number(m.lat));
//                 setValue("longitude", Number(m.lon));
//               }}
//               className={`p-2 rounded-2xl border mb-2 text-sm cursor-pointer
//       ${currentGeo?.place_id === m.place_id ? "bg-gray-200" : ""}
//     `}
//             >
//               {m?.display_name}
//             </div>
//           ))}
//         </div>
//           )
//         }

//         <MapView
//           selectable
//           latitude={watch("latitude") ?? undefined}
//           longitude={watch("longitude") ?? undefined}
//           onSelect={(lat, lng) => {
//             setValue("latitude", lat);
//             setValue("longitude", lng);
//           }}
//         />

//         {/* <MapView /> */}
//         <div className="flex justify-end mt-4">
//           <CustomButton label="Tạo mới" type="submit" />
//         </div>
//       </form>
//     </CustomModal>
//   );
// }
export default function CreateWarehouseModal({
  onClose,
  open,
}: CustomModalProps) {
  const {
    handleSubmit,
    register,
    reset,
    watch,
    setValue,
    getValues,
  } = useForm<FormType>({
    resolver: zodResolver(schema),
    defaultValues: {
      latitude: null,
      longitude: null,
    },
  });

  const [addressDetail, setAddressDetail] = useState("");
  const [currentGeo, setCurrentGeo] = useState<NominatimResult | null>(null);

  const [province, setProvince] = useState<string>("");
  const [ward, setWard] = useState<string>("");

  const { data: provinceData } = useQuery({
    queryKey: ["provinces"],
    queryFn: ProvincesApi.getAll,
  });

  const { data: wardData } = useQuery({
    queryKey: ["wards", province],
    queryFn: () => WardsApi.getAll(province),
    enabled: !!province,
  });

  const { data } = useNominatimSearch(addressDetail);

  const { mutate } = useCreateWarehouse();

  const moveMapToAddress = async (address: string) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          address,
        )}`,
      );

      const result = await res.json();

      if (result?.length > 0) {
        const location = result[0];

        setValue("latitude", Number(location.lat));
        setValue("longitude", Number(location.lon));
      }
    } catch (err) {
      console.log(err);
    }
  };

  const onSubmit = (data: FormType) => {
    mutate(
      {
        ...data,
        address_detail: currentGeo?.display_name,
      },
      {
        onSuccess: () => {
          toast.success("Tạo kho thành công");
          onClose();
          reset();
        },
      },
    );
  };

  return (
    <CustomModal
      width="w-2xl"
      title="Tạo kho"
      open={open}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-3 gap-2 pb-1 border-b mb-2 border-gray-300 pt-3">
          <div className="mb-3">
            <CustomInput
              label="Tên kho"
              type="text"
              labelType="top"
              placeholder="Nhập tên kho"
              required
              {...register("name")}
            />
          </div>

          {/* Tỉnh */}
          <div className="mb-3">
            <CustomSelect
              label="Tỉnh/Thành Phố"
              labelType="top"
              className="w-full"
              options={
                provinceData?.map((p: any) => ({
                  value: p.code,
                  label: p.name,
                })) || []
              }
              onChange={async (e) => {
                const provinceCode = e.target.value;

                setProvince(provinceCode);
                setWard("");

                const selectedProvince = provinceData?.find(
                  (p: any) => p.code == provinceCode,
                );

                if (selectedProvince) {
                  await moveMapToAddress(
                    `${selectedProvince.name}, Việt Nam`,
                  );
                }
              }}
            />
          </div>

          {/* Xã */}
          <div className="mb-3">
            <CustomSelect
              label="Xã/Phường"
              labelType="top"
              className="w-full"
              options={
                wardData?.map((w: any) => ({
                  value: w.code,
                  label: w.name,
                })) || []
              }
              onChange={async (e) => {
                const wardCode = e.target.value;

                setWard(wardCode);

                const selectedWard = wardData?.find(
                  (w: any) => w.code == wardCode,
                );

                const selectedProvince = provinceData?.find(
                  (p: any) => p.code == province,
                );

                if (selectedWard && selectedProvince) {
                  await moveMapToAddress(
                    `${selectedWard.name}, ${selectedProvince.name}, Việt Nam`,
                  );
                }
              }}
            />
          </div>

          <div className="mb-3 flex gap-2 col-span-2">
            <CustomInput
              label="Địa chỉ cụ thể"
              labelType="top"
              placeholder="Nhập địa chỉ kho"
              required
              containerClassName="w-full"
              {...register("address_detail")}
            />

            <CustomButton
              type="button"
              onClick={() =>
                setAddressDetail(getValues("address_detail"))
              }
              label="Tìm kiếm"
            />
          </div>
        </div>

        {data && (
          <div className="mb-3 border p-2 rounded border-gray-200">
            {data.map((m: any) => (
              <div
                key={m.place_id}
                onClick={() => {
                  setCurrentGeo(m);

                  setValue("latitude", Number(m.lat));
                  setValue("longitude", Number(m.lon));
                }}
                className={`p-2 rounded-2xl border mb-2 text-sm cursor-pointer
                ${
                  currentGeo?.place_id === m.place_id
                    ? "bg-gray-200"
                    : ""
                }`}
              >
                {m?.display_name}
              </div>
            ))}
          </div>
        )}

        <MapView
          selectable
          latitude={watch("latitude") ?? undefined}
          longitude={watch("longitude") ?? undefined}
          onSelect={(lat, lng) => {
            setValue("latitude", lat);
            setValue("longitude", lng);
          }}
        />

        <div className="flex justify-end mt-4">
          <CustomButton label="Tạo mới" type="submit" />
        </div>
      </form>
    </CustomModal>
  );
}
