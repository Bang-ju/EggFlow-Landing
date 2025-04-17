import { useState } from "react";
import { BlueButton } from "@/components/ui/button"; // Assuming BlueButton is used for 조회
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const CustomerFilters = () => {
  const [customerName, setCustomerName] = useState("");
  const [manager, setManager] = useState("");
  const [balanceMin, setBalanceMin] = useState("");
  const [balanceMax, setBalanceMax] = useState("");
  const [profitMin, setProfitMin] = useState("");
  const [profitMax, setProfitMax] = useState("");
  const [totalMin, setTotalMin] = useState("");
  const [totalMax, setTotalMax] = useState("");

  return (
    <div className="flex flex-wrap items-center gap-4 p-4 border-t border-border">
      {/* TODO: Replace placeholders with actual input components (Input, Select) */}
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">거래처 명</label>
        <Input
          type="text"
          placeholder="전체"
          className="w-24"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">담당자</label>
        <Select
          options={[{ label: "전체", value: "" }]}
          value={manager}
          onChange={setManager}
          className="w-24"
        />
      </div>
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">잔금 :</label>
        <Input
          type="number"
          placeholder="0"
          className="w-20 text-right"
          value={balanceMin}
          onChange={(e) => setBalanceMin(e.target.value)}
        />
        <span className="text-sm">이상</span>
        <Input
          type="number"
          placeholder="0"
          className="w-20 text-right"
          value={balanceMax}
          onChange={(e) => setBalanceMax(e.target.value)}
        />
        <span className="text-sm">이하</span>
      </div>
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">손익</label>
        <Input
          type="number"
          placeholder="0"
          className="w-20 text-right"
          value={profitMin}
          onChange={(e) => setProfitMin(e.target.value)}
        />
        <span className="text-sm">이상</span>
        <Input
          type="number"
          placeholder="0"
          className="w-20 text-right"
          value={profitMax}
          onChange={(e) => setProfitMax(e.target.value)}
        />
        <span className="text-sm">이하</span>
      </div>
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">총거래액</label>
        <Input
          type="number"
          placeholder="0"
          className="w-20 text-right"
          value={totalMin}
          onChange={(e) => setTotalMin(e.target.value)}
        />
        <span className="text-sm">이상</span>
        <Input
          type="number"
          placeholder="0"
          className="w-20 text-right"
          value={totalMax}
          onChange={(e) => setTotalMax(e.target.value)}
        />
        <span className="text-sm">이하</span>
      </div>
      <BlueButton
        onClick={() => {
          /* TODO: Add search logic */
        }}
      >
        조회
      </BlueButton>
    </div>
  );
};

export default CustomerFilters;
