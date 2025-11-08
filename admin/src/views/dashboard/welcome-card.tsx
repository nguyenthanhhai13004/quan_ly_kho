export default function WelcomeCard() {
  return (
    <div className="grid grid-cols-2 bg-white p-3 rounded-2xl gap-3">
      <div>
        <h5 className="text-xl font-semibold mb-3">
          Welcome, Nguyen Phuong Tan
        </h5>
        <p className="text-gray-400">
          Quản lý kho quân nhu hiệu quả, dễ dàng và chính xác. Theo dõi vật tư,
          trang thiết bị, tình trạng bảo trì và cấp phát — tất cả tập trung
          trong một hệ thống duy nhất. Cùng tối ưu nguồn lực và đảm bảo sẵn sàng
          cho mọi nhiệm vụ!
        </p>
      </div>
      <div>
        <img
          className="h-[180px] w-full object-cover rounded-2xl"
          src="https://cdn.prod.website-files.com/665858d6442988bba748fa67/6685962cdfeb09a7858e6883_GerenciamentodeCoresControleaConsistnciadasCoresdoSeuProjeto_Prancheta1_7dee2bcd7a36961e9d10b3cc57d37a33_2000.png"
        />
      </div>
    </div>
  );
}
