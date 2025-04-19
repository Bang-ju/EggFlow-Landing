import React from "react";
import { BlueButton, GrayButton } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useCustomerStore } from "../../../store/customerStore";
import { Customer } from "../../../types/customer";
import { useOfficialPriceStore } from "../../../store/officialPriceStore";

// TODO: Use the same Customer interface from CustomerTable

interface EditCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerData: Customer | null; // Pass the data of the customer being edited
}

const EditCustomerModal: React.FC<EditCustomerModalProps> = ({
  isOpen,
  onClose,
  customerData,
}) => {
  // 각 필드별 상태 관리 (최상단에서 호출)
  const [manager, setManager] = React.useState("");
  const [type, setType] = React.useState("");
  const [name, setName] = React.useState("");
  const [ceoName, setCeoName] = React.useState("");
  const [businessNumber, setBusinessNumber] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [region, setRegion] = React.useState("");
  const [discount, setDiscount] = React.useState(0);
  const [address, setAddress] = React.useState("");

  const updateCustomer = useCustomerStore((state) => state.updateCustomer);
  const prices = useOfficialPriceStore((state) => state.prices);
  const regionOptions = Array.from(new Set(prices.map((p) => p.region))).map(
    (region) => ({ label: region, value: region })
  );
  regionOptions.unshift({ label: "-", value: "" });

  // customerData가 변경될 때마다 상태 초기화
  React.useEffect(() => {
    if (customerData) {
      setManager(customerData.manager || "");
      setType(customerData.type || "");
      setName(customerData.name || "");
      setCeoName(customerData.ceoName || "");
      setBusinessNumber(customerData.businessNumber || "");
      setPhone(customerData.phone || "");
      setRegion(customerData.region || "");
      setDiscount(customerData.discount || 0);
      setAddress(customerData.address || "");
    }
  }, [customerData]);

  const handleSave = () => {
    if (!customerData) return;
    if (
      !name ||
      !manager ||
      !type ||
      !ceoName ||
      !businessNumber ||
      !phone ||
      !region ||
      !address
    ) {
      alert("필수 항목을 모두 입력해 주세요.");
      return;
    }
    const updatedCustomer: Customer = {
      ...customerData,
      name,
      manager,
      type,
      ceoName,
      businessNumber,
      phone,
      address,
      region,
      discount,
      // registrationDate, balance, profit, totalTransaction 등은 기존 값 유지
    };
    updateCustomer(updatedCustomer);
    onClose();
  };

  if (!isOpen || !customerData) return null;

  return (
    <div className="fixed inset-0 bg-gray-500/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-[780px]">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold">거래처 수정</h2>
        </div>
        <div className="p-6 space-y-6">
          {/* TODO: Pre-fill form fields with customerData */}
          <div className="grid grid-cols-2 gap-x-10 gap-y-4">
            {/* Row 1 */}
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
                value={type}
                onChange={setType}
                className="mt-1 block w-full sm:text-sm"
              />
            </div>
            {/* Row 2 */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                거래처 명 *
              </label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="거래처 명"
                className="mt-1 block w-full sm:text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                대표자 명 *
              </label>
              <Input
                type="text"
                value={ceoName}
                onChange={(e) => setCeoName(e.target.value)}
                placeholder="대표자 명"
                className="mt-1 block w-full sm:text-sm"
              />
            </div>
            {/* Row 3 */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                사업자 번호 *
              </label>
              <Input
                type="text"
                value={businessNumber}
                onChange={(e) => setBusinessNumber(e.target.value)}
                placeholder="사업자 번호"
                className="mt-1 block w-full sm:text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                전화번호 *
              </label>
              <Input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="전화번호"
                className="mt-1 block w-full sm:text-sm"
              />
            </div>
            {/* Row 4 */}
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
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
                placeholder="0"
                className="mt-1 block w-full sm:text-sm text-right"
              />
            </div>
            {/* Row 5 */}
            <div className="col-span-2 space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                주소 *
              </label>
              <Input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="주소"
                className="mt-1 block w-full sm:text-sm"
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

export default EditCustomerModal;
