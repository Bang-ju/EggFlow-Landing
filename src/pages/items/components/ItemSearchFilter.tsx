import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { BlueButton, GrayButton } from "@/components/ui/button";
// import { Button } from '@/components/ui/button'; // 추후 Button 컴포넌트 사용
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; // 추후 Select 컴포넌트 사용

// Props 타입 정의 추가
interface ItemSearchFilterProps {
  onOpenOfficialPrice: () => void; // 공시가 확인 버튼 클릭 핸들러
  onSearch: (criteria: {
    // onSearch prop 추가
    query: string;
    spec: string;
    packaging: string;
  }) => void;
}

const ItemSearchFilter: React.FC<ItemSearchFilterProps> = ({
  onOpenOfficialPrice,
  onSearch, // onSearch prop 받기
}) => {
  // 검색 필드 상태 관리
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpec, setSelectedSpec] = useState("");
  const [selectedPackaging, setSelectedPackaging] = useState("");

  // 조회 버튼 클릭 핸들러
  const handleSearchClick = () => {
    onSearch({
      query: searchQuery,
      spec: selectedSpec,
      packaging: selectedPackaging,
    });
  };

  return (
    <div className="bg-white p-4 border-t border-border flex justify-between items-center">
      <div className="flex items-center space-x-4">
        {/* 품목 검색 */}
        <div className="flex items-center space-x-2">
          <label htmlFor="itemSearch" className="text-sm font-medium">
            품목 검색
          </label>
          <Input
            id="itemSearch"
            type="text"
            placeholder="품목코드/품목이름"
            className="w-40 sm:text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {/* 규격 선택 */}
        <div className="flex items-center space-x-2">
          <label htmlFor="specSelect" className="text-sm font-medium">
            규격
          </label>
          <Select
            value={selectedSpec}
            onChange={setSelectedSpec}
            className="w-[100px] sm:text-sm"
            options={[
              { label: "규격", value: "" },
              { label: "왕란", value: "왕란" },
              { label: "특란", value: "특란" },
              { label: "대란", value: "대란" },
            ]}
          />
        </div>
        {/* 포장 선택 */}
        <div className="flex items-center space-x-2">
          <label htmlFor="packagingSelect" className="text-sm font-medium">
            포장
          </label>
          <Select
            value={selectedPackaging}
            onChange={setSelectedPackaging}
            className="w-[100px] sm:text-sm"
            options={[
              { label: "전체", value: "" },
              { label: "벌크", value: "벌크" },
            ]}
          />
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <GrayButton onClick={onOpenOfficialPrice}>공시가 확인</GrayButton>
        <BlueButton onClick={handleSearchClick}>조회</BlueButton>
      </div>
    </div>
  );
};

export default ItemSearchFilter;
