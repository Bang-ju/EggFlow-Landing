import React, { useEffect, useState } from "react";
import { Select } from "@/components/ui/select";
import { BlueButton, GrayButton } from "@/components/ui/button";
import { OfficialPriceDialog } from "@/components/ui/OfficialPriceDialog";
import { useCustomerStore } from "@/store/customerStore";
import { useSalesStore } from "@/store/salesStore";
import type { Sale } from "@/store/salesStore";
import { DatePicker } from "@/components/ui/DatePicker";

// 매출 목록 컴포넌트
interface SalesListProps {
  onSelectSale: (sale: Sale) => void;
}

export const SalesList = ({ onSelectSale }: SalesListProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [officialPriceOpen, setOfficialPriceOpen] = useState(false);
  const [salesLength, setSalesLength] = useState(0);

  // zustand에서 매출 목록 불러오기
  const sales: Sale[] = useSalesStore((state) => state.sales);
  const customers = useCustomerStore((state) => state.customers);
  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

  const [searchDateStart, setSearchDateStart] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [searchDateEnd, setSearchDateEnd] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [searchCustomerId, setSearchCustomerId] = useState<string>("all");
  const [searchedSales, setSearchedSales] = useState<Sale[]>([]);

  const handleSearch = () => {
    setSearchedSales(
      sales
        .filter(
          (sale) => sale.date >= searchDateStart && sale.date <= searchDateEnd
        )
        .filter(
          (sale) =>
            searchCustomerId === "all" || sale.customerId === searchCustomerId
        )
    );
  };

  useEffect(() => {
    handleSearch();
  }, [sales]);

  useEffect(() => {
    if (sales.length > 0 && salesLength !== sales.length) {
      setSelectedSale(sales[sales.length - 1]);
      setSalesLength(sales.length);
    }
  }, [sales]);

  return (
    <div className="flex flex-col gap-2 bg-white rounded-[4px] w-full">
      {/* 헤더 */}
      <div
        className="flex justify-between items-center p-2 pt-2 px-4 cursor-pointer"
        onClick={toggleOpen}
      >
        <div className="flex items-center">
          <h2 className="text-xl font-bold">매출 목록</h2>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`transform ${
              isOpen ? "rotate-0" : "rotate-180"
            } transition-transform`}
          >
            <path d="M7 10L12 15L17 10H7Z" fill="#1D1B20" />
          </svg>
        </div>
        <div className="flex gap-4">
          <GrayButton className="text-sm" onClick={(e) => e.stopPropagation()}>
            액셀 다운로드
          </GrayButton>
          <GrayButton className="text-sm" onClick={(e) => e.stopPropagation()}>
            인쇄
          </GrayButton>
          <GrayButton
            className="text-sm"
            onClick={(e) => {
              e.stopPropagation();
              setOfficialPriceOpen(true);
            }}
          >
            공시가 확인
          </GrayButton>
        </div>
      </div>

      {/* 콘텐츠 영역 - 접히는 부분 */}
      {isOpen && (
        <>
          {/* 검색 필터 */}
          <div className="p-4 bg-white border-t border-b flex flex-row justify-between">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-4">
                <span className="font-medium">거래일자</span>
                <div className="flex items-center text-sm">
                  <DatePicker
                    className="min-w-32"
                    value={searchDateStart}
                    onChange={(value) => setSearchDateStart(value)}
                  />
                  <span className="mx-2">-</span>
                  <DatePicker
                    className="min-w-32"
                    value={searchDateEnd}
                    onChange={(value) => setSearchDateEnd(value)}
                  />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-medium">거래처</span>
                <Select
                  options={[
                    { value: "all", label: "전체" },
                    ...customers.map((customer) => ({
                      value: customer.id.toString(),
                      label: customer.name,
                    })),
                  ]}
                  onChange={(value) => setSearchCustomerId(value)}
                  value={searchCustomerId}
                  placeholder="전체"
                  className="min-w-32"
                />
              </div>
              {/* <div className="flex items-center gap-4">
                <span className="font-medium min-w-20">담당자</span>
                <Select
                  options={[
                    { value: "all", label: "전체" },
                    { value: "manager1", label: "서장준" },
                  ]}
                  onChange={(value) => console.log(value)}
                  placeholder="전체"
                  className="min-w-32"
                />
              </div> */}
            </div>
            <div className="">
              <BlueButton className="text-sm" onClick={handleSearch}>
                조회
              </BlueButton>
            </div>
          </div>

          {/* 매출 목록 테이블 */}
          <div className="bg-white p-4">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border p-2 text-center min-w-20 text-sm font-bold">
                      연번
                    </th>
                    <th className="border p-2 text-center min-w-32 text-sm font-bold">
                      거래일자
                    </th>
                    <th className="border p-2 text-center min-w-32 text-sm font-bold">
                      거래처
                    </th>
                    <th className="border p-2 text-center min-w-20 text-sm font-bold">
                      담당자
                    </th>
                    <th className="border p-2 text-center min-w-20 text-sm font-bold">
                      총 알 수
                    </th>
                    <th className="border p-2 text-center min-w-20 text-sm font-bold">
                      총 판 수
                    </th>
                    <th className="border p-2 text-center min-w-20 text-sm font-bold">
                      금액
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {searchedSales.map((sale, index) => (
                    <tr
                      key={sale.id}
                      className={`text-sm cursor-pointer hover:bg-blue-50 ${
                        selectedSale?.id === sale.id
                          ? "bg-blue-50"
                          : index % 2 === 1
                          ? "bg-gray-100"
                          : "bg-white"
                      }`}
                      onClick={() => {
                        setSelectedSale(sale);
                        onSelectSale(sale);
                      }}
                    >
                      <td className="border p-2 text-center">{index + 1}</td>
                      <td className="border p-2 text-center">{sale.date}</td>
                      <td className="border p-2">
                        {
                          customers.find(
                            (c) => c.id.toString() === sale.customerId
                          )?.name
                        }
                      </td>
                      <td className="border p-2">{sale.manager}</td>
                      <td className="border p-2 text-right">
                        {sale.items
                          .reduce((sum, item) => sum + item.quantityEgg, 0)
                          .toLocaleString()}
                      </td>
                      <td className="border p-2 text-right">
                        {Math.floor(
                          sale.items.reduce(
                            (sum, item) => sum + item.quantityEgg,
                            0
                          ) / 30
                        ).toLocaleString()}
                      </td>
                      <td className="border p-2 text-right">
                        ₩{sale.totalAmount.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-gray-50 font-bold">
                    <td colSpan={4} className="border p-2">
                      합계
                    </td>
                    <td className="border p-2 text-right">
                      {searchedSales
                        .reduce(
                          (sum, sale) =>
                            sum +
                            sale.items.reduce(
                              (s, item) => s + item.quantityEgg,
                              0
                            ),
                          0
                        )
                        .toLocaleString()}
                    </td>
                    <td className="border p-2 text-right">
                      {Math.floor(
                        searchedSales.reduce(
                          (sum, sale) =>
                            sum +
                            sale.items.reduce(
                              (s, item) => s + item.quantityEgg,
                              0
                            ),
                          0
                        ) / 30
                      ).toLocaleString()}
                    </td>
                    <td className="border p-2 text-right">
                      ₩
                      {searchedSales
                        .reduce((sum, sale) => sum + sale.totalAmount, 0)
                        .toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
      <OfficialPriceDialog
        isOpen={officialPriceOpen}
        onClose={() => setOfficialPriceOpen(false)}
      />
    </div>
  );
};
