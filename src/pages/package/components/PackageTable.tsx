import React from "react";
import Checkbox from "@/components/ui/Checkbox"; // Checkbox 컴포넌트 import
// import Table from '@/components/ui/Table'; // 추후 생성 예정

// Package 타입 정의 (Page에서 사용하는 타입과 일치해야 함)
interface Package {
  id?: number;
  name: string;
  unit: string;
  cost: string;
  remarks: string;
  modifiedDate?: string;
  createdDate?: string;
}

// Props 타입 정의
interface PackageTableProps {
  data: Package[];
  selectedIds: number[];
  onCheckboxChange: (id: number, isChecked: boolean) => void;
  onHeaderCheckboxChange: (isChecked: boolean) => void;
}

const PackageTable: React.FC<PackageTableProps> = ({
  data,
  selectedIds,
  onCheckboxChange,
  onHeaderCheckboxChange,
}) => {
  const headers = ["연번", "포장명", "단위", "포장비", "수정일", "등록일"];

  // 헤더 체크박스 상태 계산
  const numItems = data.length;
  const numSelected = selectedIds.length;
  const isHeaderChecked = numItems > 0 && numSelected === numItems;
  const isHeaderIndeterminate = numSelected > 0 && numSelected < numItems;
  const headerCheckboxRef = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => {
    if (headerCheckboxRef.current) {
      headerCheckboxRef.current.indeterminate = isHeaderIndeterminate;
    }
  }, [isHeaderIndeterminate]);

  return (
    <div>
      {/* <Table headers={headers}> ... </Table> */}
      {/* 추후 Table 컴포넌트 사용 */}
      <table className="w-full border-collapse border border-gray-300 text-sm">
        {/* text-sm 추가 */}
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2 w-12 text-center">
              <input
                ref={headerCheckboxRef}
                type="checkbox"
                className="form-checkbox h-4 w-4 text-blue-600 border-gray-300 rounded"
                checked={isHeaderChecked}
                onChange={(e) => onHeaderCheckboxChange(e.target.checked)}
                aria-label="Select all"
              />
            </th>
            {headers.map((header) => (
              <th
                key={header}
                className="border border-gray-300 px-4 py-2 text-left font-semibold" /* font-semibold로 변경 */
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={row.id}
              className={selectedIds.includes(row.id!) ? "bg-blue-100" : ""}
            >
              <td className="border border-gray-300 px-4 py-2 text-center">
                <Checkbox
                  checked={selectedIds.includes(row.id!)}
                  onChange={(e) => onCheckboxChange(row.id!, e.target.checked)}
                />
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                {row.id}
              </td>
              {/* 가운데 정렬 */}
              <td className="border border-gray-300 px-4 py-2">{row.name}</td>
              <td className="border border-gray-300 px-4 py-2 text-right">
                {row.unit}
              </td>
              {/* 오른쪽 정렬 */}
              <td className="border border-gray-300 px-4 py-2 text-right">
                {row.cost}
              </td>
              {/* 오른쪽 정렬 */}
              <td className="border border-gray-300 px-4 py-2 text-center">
                {row.modifiedDate}
              </td>
              {/* 가운데 정렬 */}
              <td className="border border-gray-300 px-4 py-2 text-center">
                {row.createdDate}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PackageTable;
