import React from "react";
import { useCustomerStore } from "../../../store/customerStore";
import { Customer } from "../../../types/customer";

// Add props interface for CustomerTable
interface CustomerTableProps {
  onEditClick: (customer: Customer) => void;
  selectedRows: number[];
  setSelectedRows: React.Dispatch<React.SetStateAction<number[]>>;
}

const CustomerTable: React.FC<CustomerTableProps> = ({
  onEditClick,
  selectedRows,
  setSelectedRows,
}) => {
  const customers = useCustomerStore((state) => state.customers);
  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedRows(customers.map((customer) => customer.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id: number) => {
    setSelectedRows((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((rowId) => rowId !== id)
        : [...prevSelected, id]
    );
  };

  return (
    <div className="bg-white p-4 border-t border-border overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
        {/* 테이블 헤더 */}
        <thead className="bg-[#F8FAFC]">
          <tr>
            <th
              scope="col"
              className="px-4 py-2 text-center text-xs font-bold text-gray-700 uppercase tracking-wider w-[80px] border border-border whitespace-nowrap"
            >
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 text-blue-600 border-gray-300 rounded"
                onChange={handleSelectAll}
                checked={
                  selectedRows.length === customers.length &&
                  customers.length > 0
                }
              />
            </th>
            <th
              scope="col"
              className="px-4 py-2 text-center text-xs font-bold text-gray-700 uppercase tracking-wider w-[80px] border border-border whitespace-nowrap"
            >
              연번
            </th>
            <th
              scope="col"
              className="px-4 py-2 text-center text-xs font-bold text-gray-700 uppercase tracking-wider w-[240px] border border-border whitespace-nowrap"
            >
              거래처 명
            </th>
            <th
              scope="col"
              className="px-4 py-2 text-center text-xs font-bold text-gray-700 uppercase tracking-wider w-[180px] border border-border whitespace-nowrap"
            >
              담당자
            </th>
            <th
              scope="col"
              className="px-4 py-2 text-center text-xs font-bold text-gray-700 uppercase tracking-wider w-[180px] border border-border whitespace-nowrap"
            >
              거래처 유형
            </th>
            <th
              scope="col"
              className="px-4 py-2 text-center text-xs font-bold text-gray-700 uppercase tracking-wider w-[180px] border border-border whitespace-nowrap"
            >
              대표자 명
            </th>
            <th
              scope="col"
              className="px-4 py-2 text-center text-xs font-bold text-gray-700 uppercase tracking-wider w-[180px] border border-border whitespace-nowrap"
            >
              사업자 번호
            </th>
            <th
              scope="col"
              className="px-4 py-2 text-center text-xs font-bold text-gray-700 uppercase tracking-wider w-[180px] border border-border whitespace-nowrap"
            >
              전화번호
            </th>
            <th
              scope="col"
              className="px-4 py-2 text-center text-xs font-bold text-gray-700 uppercase tracking-wider w-[240px] border border-border whitespace-nowrap"
            >
              주소
            </th>
            <th
              scope="col"
              className="px-4 py-2 text-center text-xs font-bold text-gray-700 uppercase tracking-wider w-[180px] border border-border whitespace-nowrap"
            >
              공시가 적용 지역
            </th>
            <th
              scope="col"
              className="px-4 py-2 text-center text-xs font-bold text-gray-700 uppercase tracking-wider w-[100px] border border-border whitespace-nowrap"
            >
              DC
            </th>
            <th
              scope="col"
              className="px-4 py-2 text-center text-xs font-bold text-gray-700 uppercase tracking-wider w-[180px] border border-border whitespace-nowrap"
            >
              등록일
            </th>
            <th
              scope="col"
              className="px-4 py-2 text-center text-xs font-bold text-gray-700 uppercase tracking-wider w-[180px] border border-border whitespace-nowrap"
            >
              잔금
            </th>
            <th
              scope="col"
              className="px-4 py-2 text-center text-xs font-bold text-gray-700 uppercase tracking-wider w-[180px] border border-border whitespace-nowrap"
            >
              손익
            </th>
            <th
              scope="col"
              className="px-4 py-2 text-center text-xs font-bold text-gray-700 uppercase tracking-wider w-[180px] border border-border whitespace-nowrap"
            >
              총 거래액
            </th>
          </tr>
        </thead>

        {/* 테이블 바디 */}
        <tbody className="bg-white divide-y divide-gray-200">
          {customers.map((customer, index) => {
            return (
              <tr
                key={customer.id}
                className={`${
                  selectedRows.includes(customer.id) ? "bg-blue-100" : ""
                }`}
              >
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 text-center border border-border">
                  <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4 text-blue-600 border-gray-300 rounded"
                    checked={selectedRows.includes(customer.id)}
                    onChange={() => handleSelectRow(customer.id)}
                  />
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 text-right border border-border">
                  {index + 1}
                </td>
                <td
                  onClick={() => onEditClick(customer)}
                  className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 border border-border cursor-pointer hover:bg-gray-50"
                >
                  {customer.name}
                </td>
                <td
                  onClick={() => onEditClick(customer)}
                  className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 border border-border cursor-pointer hover:bg-gray-50"
                >
                  {customer.manager}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 border border-border">
                  {customer.type}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 border border-border">
                  {customer.ceoName}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 text-right border border-border">
                  {customer.businessNumber}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 border border-border">
                  {customer.phone}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 border border-border">
                  {customer.address}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 border border-border">
                  {customer.region}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 text-right border border-border">
                  {customer.discount}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 text-center border border-border">
                  {customer.registrationDate}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 text-right border border-border">
                  ₩{customer.balance.toLocaleString()}
                </td>
                <td
                  className={`px-4 py-2 whitespace-nowrap text-sm text-right border border-border ${
                    customer.profit >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {customer.profit >= 0 ? "+" : ""}₩
                  {customer.profit.toLocaleString()}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 text-right border border-border">
                  ₩{customer.totalTransaction.toLocaleString()}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {/* TODO: Add pagination component */}
    </div>
  );
};

export default CustomerTable;
