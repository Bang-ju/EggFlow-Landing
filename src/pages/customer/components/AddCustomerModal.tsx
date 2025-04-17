import React, { useState } from "react";
import { BlueButton, GrayButton } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useCustomerStore } from "../../../store/customerStore";
import { Customer } from "../../../types/customer";
import { useOfficialPriceStore } from "../../../store/officialPriceStore";

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddCustomerModal: React.FC<AddCustomerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [manager, setManager] = useState("");
  const [customerType, setCustomerType] = useState("");
  const [region, setRegion] = useState("");
  const [name, setName] = useState("");
  const [ceoName, setCeoName] = useState("");
  const [businessNumber, setBusinessNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [discount, setDiscount] = useState(0);
  const [address, setAddress] = useState("");

  const addCustomer = useCustomerStore((state) => state.addCustomer);
  const prices = useOfficialPriceStore((state) => state.prices);
  const regionOptions = Array.from(new Set(prices.map((p) => p.region))).map(
    (region) => ({ label: region, value: region })
  );
  regionOptions.unshift({ label: "-", value: "" });

  if (!isOpen) return null;

  const handleSave = () => {
    if (
      !name ||
      !manager ||
      !customerType ||
      !ceoName ||
      !businessNumber ||
      !phone ||
      !region ||
      !address
    ) {
      alert("필수 항목을 모두 입력해 주세요.");
      return;
    }
    const newCustomer: Customer = {
      id: Date.now(),
      name,
      manager,
      type: customerType,
      ceoName,
      businessNumber,
      phone,
      address,
      region,
      discount,
      registrationDate: new Date().toISOString().slice(0, 10),
      balance: 0,
      profit: 0,
      totalTransaction: 0,
    };
    addCustomer(newCustomer);
    setName("");
    setManager("");
    setCustomerType("");
    setCeoName("");
    setBusinessNumber("");
    setPhone("");
    setRegion("");
    setDiscount(0);
    setAddress("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-500/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-[780px]">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold">거래처 추가</h2>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-x-10 gap-y-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                담당자 *
              </label>
              <Select
                options={[{ label: "-", value: "" }]}
                value={manager}
                onChange={setManager}
                className="mt-1 block w-full sm:text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                거래처 유형 *
              </label>
              <Select
                options={[
                  { label: "-", value: "" },
                  { label: "매입", value: "매입" },
                  { label: "매출", value: "매출" },
                ]}
                value={customerType}
                onChange={setCustomerType}
                className="mt-1 block w-full sm:text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                거래처 명 *
              </label>
              <Input
                type="text"
                placeholder="거래처 명"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                대표자 명 *
              </label>
              <Input
                type="text"
                placeholder="대표자 명"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={ceoName}
                onChange={(e) => setCeoName(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                사업자 번호 *
              </label>
              <Input
                type="text"
                placeholder="사업자 번호"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={businessNumber}
                onChange={(e) => setBusinessNumber(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                전화번호 *
              </label>
              <Input
                type="text"
                placeholder="전화번호"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                공시가 적용 지역 *
              </label>
              <Select
                options={regionOptions}
                value={region}
                onChange={setRegion}
                className="mt-1 block w-full sm:text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                DC *
              </label>
              <Input
                type="number"
                placeholder="0"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-right"
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
              />
            </div>
            <div className="col-span-2 space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                주소 *
              </label>
              <Input
                type="text"
                placeholder="주소"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-2">
          <GrayButton onClick={onClose}>취소</GrayButton>
          <BlueButton onClick={handleSave}>저장</BlueButton>
        </div>
      </div>
    </div>
  );
};

export default AddCustomerModal;
