import React from "react";
import { Input } from "@/components/ui/input";

interface PriceTableRow {
  itemName: string;
  spec: string;
  packaging: string;
  unit: string | number;
  basePrice: number;
  dc: number;
  finalPrice: number;
  diff: number;
  modified: string;
  created: string;
  itemId: string;
  customerId: string;
}

interface PriceTableProps {
  data: PriceTableRow[];
  onChange: (itemId: string, field: "dc" | "finalPrice", value: number) => void;
}

const PriceTable: React.FC<PriceTableProps> = ({ data, onChange }) => {
  return (
    <div className="bg-white p-4 border-t border-border shadow overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
        <thead className="bg-[#F8FAFC]">
          <tr>
            <th className="px-4 py-2 text-center text-sm font-bold text-gray-700 uppercase tracking-wider border border-border whitespace-nowrap">
              품목명
            </th>
            <th className="px-4 py-2 text-center text-sm font-bold text-gray-700 uppercase tracking-wider border border-border whitespace-nowrap">
              규격
            </th>
            <th className="px-4 py-2 text-center text-sm font-bold text-gray-700 uppercase tracking-wider border border-border whitespace-nowrap">
              포장명
            </th>
            <th className="px-4 py-2 text-center text-sm font-bold text-gray-700 uppercase tracking-wider border border-border whitespace-nowrap">
              단위
            </th>
            <th className="px-4 py-2 text-center text-sm font-bold text-gray-700 uppercase tracking-wider border border-border whitespace-nowrap">
              기본단가
            </th>
            <th className="px-4 py-2 text-center text-sm font-bold text-gray-700 uppercase tracking-wider border border-border whitespace-nowrap">
              DC
            </th>
            <th className="px-4 py-2 text-center text-sm font-bold text-gray-700 uppercase tracking-wider border border-border whitespace-nowrap">
              최종단가
            </th>
            <th className="px-4 py-2 text-center text-sm font-bold text-gray-700 uppercase tracking-wider border border-border whitespace-nowrap">
              단가-공시가 차이
            </th>
            <th className="px-4 py-2 text-center text-sm font-bold text-gray-700 uppercase tracking-wider border border-border whitespace-nowrap">
              수정일
            </th>
            <th className="px-4 py-2 text-center text-sm font-bold text-gray-700 uppercase tracking-wider border border-border whitespace-nowrap">
              등록일
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row) => (
            <tr key={row.itemId} className="">
              <td className="px-4 py-2 whitespace-nowrap text-center border border-border text-sm text-gray-700 bg-[#F7F7F7]">
                {row.itemName}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-center border border-border text-sm text-gray-700 bg-[#F7F7F7]">
                {row.spec}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-center border border-border text-sm text-gray-700 bg-[#F7F7F7]">
                {row.packaging}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-center border border-border text-sm text-gray-700 bg-[#F7F7F7]">
                {row.unit}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-center border border-border text-sm text-gray-500 bg-[#F7F7F7]">
                {row.basePrice.toLocaleString()}
              </td>
              <td className="border border-border text-sm">
                <Input
                  type="number"
                  value={row.dc}
                  onChange={(e) =>
                    onChange(row.itemId, "dc", Number(e.target.value))
                  }
                  className="w-full px-0 py-0 border-none rounded-none text-sm text-right bg-white focus:outline-none focus:ring-0"
                />
              </td>
              <td className="border border-border text-sm">
                <Input
                  type="number"
                  value={row.finalPrice}
                  onChange={(e) =>
                    onChange(row.itemId, "finalPrice", Number(e.target.value))
                  }
                  className="w-full px-0 py-0 border-none rounded-none text-sm text-right bg-white focus:outline-none focus:ring-0"
                />
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-center border border-border text-sm text-gray-500 bg-[#F7F7F7]">
                {row.diff.toLocaleString()}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-center border border-border text-sm text-gray-500 bg-[#F7F7F7]">
                {row.modified}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-center border border-border text-sm text-gray-500 bg-[#F7F7F7]">
                {row.created}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PriceTable;
