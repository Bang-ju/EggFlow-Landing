import React from "react";
import { Input } from "@/components/ui/input"; // Input 컴포넌트 import
import { BlueButton } from "@/components/ui/button";
// import Button from "@/components/ui/button"; // Button 컴포넌트 import
// import Input from '@/components/ui/Input'; // 추후 생성 예정
// import Button from '@/components/ui/Button'; // 추후 생성 예정

const PackageSearchForm: React.FC = () => {
  return (
    <div className="flex items-center space-x-4">
      <span className="font-medium">포장 검색</span>
      <Input type="text" placeholder="포장명" className="w-40" />{" "}
      {/* Input 컴포넌트 사용 */}
      {/* <Input placeholder="포장명" className="w-40" /> */}{" "}
      {/* 추후 Input 컴포넌트 사용 */}
      {/* <input
        type="text"
        placeholder="포장명"
        className="border rounded px-2 py-1 w-40"
      /> */}
      <BlueButton>조회</BlueButton>
      {/* <Button variant="primary" size="sm">
        조회
      </Button> */}
      {/* <Button variant="primary">조회</Button> */}{" "}
      {/* 추후 Button 컴포넌트 사용 */}
      {/* <button className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700">
        조회
      </button> */}
    </div>
  );
};

export default PackageSearchForm;
