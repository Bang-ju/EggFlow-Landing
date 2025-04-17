import { useState } from "react";
import { Input } from "@/components/ui/input";
import { BlueButton } from "@/components/ui/button";
import { Dialog } from "@/components/layout/dialog";
import { Select } from "@/components/ui/select";
import { useUserStore } from "../../store/userStore";
import { useOfficialPriceStore } from "../../store/officialPriceStore";

export const UserMain = () => {
  const [isOpen, setIsOpen] = useState(false);
  const user = useUserStore((state) => state.user);
  const updateUser = useUserStore((state) => state.updateUser);
  const prices = useOfficialPriceStore((state) => state.prices);
  const regionOptions = Array.from(new Set(prices.map((p) => p.region))).map(
    (region) => ({ label: region, value: region })
  );
  regionOptions.unshift({ label: "지역 선택", value: "" });

  // 임시 입력값 상태
  const [form, setForm] = useState(user);

  // user 상태가 바뀌면 form도 동기화
  // (예: 다른 곳에서 user가 바뀌었을 때)

  // useEffect(() => { setForm(user); }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegionChange = (region: string) => {
    setForm((prev) => ({ ...prev, region }));
  };

  const handleSave = () => {
    updateUser(form);
    setIsOpen(true);
    // 여기에 저장 API 호출 로직 추가
  };

  const handleAddressSearch = () => {
    // 주소 검색 로직 구현
    console.log("주소 검색");
  };

  return (
    <div className="flex flex-col w-full h-full">
      <Dialog isOpen={isOpen} setIsOpen={setIsOpen} title="저장 완료">
        <div className="flex flex-col">저장되었습니다.</div>
      </Dialog>
      <div className="bg-white w-full rounded-md flex flex-col">
        {/* 헤더 */}
        <div className="flex items-center p-4 pb-0 ml-2">
          <h1 className="text-xl font-bold">사업자 관리</h1>
        </div>

        {/* 사업자 정보 폼 */}
        <div className="border-t border-[#E5E7EB] mt-2 p-4">
          <div className="flex flex-col gap-2">
            {/* 회사명 */}
            <div className="flex flex-col mb-1 w-[250px]">
              <label className="mb-1">회사명</label>
              <Input
                type="text"
                name="companyName"
                value={form.companyName}
                onChange={handleChange}
                className="w-full outline-none text-[#262626]"
              />
            </div>

            {/* 대표자명 */}
            <div className="flex flex-col mb-1 w-[250px]">
              <label className=" mb-1">대표자명</label>
              <Input
                type="text"
                name="ceoName"
                value={form.ceoName}
                onChange={handleChange}
                className="w-full outline-none  text-[#262626]"
              />
            </div>

            {/* 전화번호 */}
            <div className="flex flex-col mb-1 w-[250px]">
              <label className=" mb-1">전화번호</label>
              <Input
                type="text"
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
                className="w-full outline-none text-[#262626]"
              />
            </div>

            {/* 주소 */}
            <div className="flex flex-col mb-1 gap-2">
              <label>주소</label>
              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  name="zipCode"
                  value={form.zipCode}
                  onChange={handleChange}
                  placeholder="우편번호"
                  className="w-[240px] outline-none"
                  readOnly
                />
                <BlueButton onClick={handleAddressSearch}>주소 검색</BlueButton>
              </div>

              <div className="w-[340px]">
                <Input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="기본주소"
                  className="w-full outline-none"
                  readOnly
                />
              </div>

              <div className="w-[340px]">
                <Input
                  type="text"
                  name="addressDetail"
                  value={form.addressDetail}
                  onChange={handleChange}
                  placeholder="상세주소"
                  className="w-full outline-none"
                />
              </div>
            </div>

            {/* 공시가 적용 지역 */}
            <div className="flex flex-col mb-1 w-[250px]">
              <label className="mb-1">공시가 적용 지역</label>
              <Select
                options={regionOptions}
                value={form.region}
                onChange={handleRegionChange}
                placeholder="지역 선택"
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* 저장 버튼 */}
        <div className="border-t border-[#E5E7EB] p-4 flex justify-start">
          <BlueButton onClick={handleSave}>저장</BlueButton>
        </div>
      </div>
    </div>
  );
};
