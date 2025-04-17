import React from "react";
import { Item } from "../../../types/item";
import { usePackageStore } from "../../../store/packageStore";
import { useOfficialPriceStore } from "../../../store/officialPriceStore";
import { useUserStore } from "../../../store/userStore";

// Props 타입 정의
interface ItemTableProps {
  items: Item[];
  selectedItemIds: Set<string>;
  onSelectionChange: (itemId: string, isSelected: boolean) => void;
  onSelectAll: (isAllSelected: boolean) => void;
}

const ItemTable: React.FC<ItemTableProps> = ({
  items,
  selectedItemIds,
  onSelectionChange,
  onSelectAll,
}) => {
  const packages = usePackageStore((state) => state.packages);
  const prices = useOfficialPriceStore((state) => state.prices);
  const region = useUserStore((state) => state.user.region);

  const handleSelectAllChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    onSelectAll(event.target.checked);
  };

  const handleRowCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    itemId: string
  ) => {
    onSelectionChange(itemId, event.target.checked);
  };

  // items 배열이 비어있지 않고 모든 아이템이 선택되었는지 확인
  const isAllSelected =
    items.length > 0 && selectedItemIds.size === items.length;
  const isIndeterminate =
    selectedItemIds.size > 0 && selectedItemIds.size < items.length;

  const headerCheckboxRef = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => {
    if (headerCheckboxRef.current) {
      headerCheckboxRef.current.indeterminate = isIndeterminate;
    }
  }, [isIndeterminate]);

  return (
    <div className="border-t border-border overflow-hidden p-4">
      <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
        <thead className="bg-[#F8FAFC]">
          <tr>
            <th
              scope="col"
              className="px-4 py-2 text-center text-xs font-bold text-gray-700 uppercase tracking-wider w-[80px] border border-border whitespace-nowrap"
            >
              <input
                ref={headerCheckboxRef}
                type="checkbox"
                className="form-checkbox h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                checked={isAllSelected}
                onChange={handleSelectAllChange}
                aria-label="Select all items"
              />
            </th>
            <th
              scope="col"
              className="px-4 py-2 text-center text-xs font-bold text-gray-700 uppercase tracking-wider w-[100px] border border-border whitespace-nowrap"
            >
              품목코드
            </th>
            <th
              scope="col"
              className="px-4 py-2 text-center text-xs font-bold text-gray-700 uppercase tracking-wider w-[240px] border border-border whitespace-nowrap"
            >
              품목명
            </th>
            <th
              scope="col"
              className="px-4 py-2 text-center text-xs font-bold text-gray-700 uppercase tracking-wider w-[120px] border border-border whitespace-nowrap"
            >
              규격
            </th>
            <th
              scope="col"
              className="px-4 py-2 text-center text-xs font-bold text-gray-700 uppercase tracking-wider w-[120px] border border-border whitespace-nowrap"
            >
              포장
            </th>
            <th
              scope="col"
              className="px-4 py-2 text-center text-xs font-bold text-gray-700 uppercase tracking-wider w-[100px] border border-border whitespace-nowrap"
            >
              단위
            </th>
            <th
              scope="col"
              className="px-4 py-2 text-right text-xs font-bold text-gray-700 uppercase tracking-wider w-[120px] border border-border whitespace-nowrap"
            >
              단가
            </th>
            <th
              scope="col"
              className="px-4 py-2 text-center text-xs font-bold text-gray-700 uppercase tracking-wider w-[140px] border border-border whitespace-nowrap"
            >
              단가-공시가 차이
            </th>
            <th
              scope="col"
              className="px-4 py-2 text-center text-xs font-bold text-gray-700 uppercase tracking-wider w-[140px] border border-border whitespace-nowrap"
            >
              수정일
            </th>
            <th
              scope="col"
              className="px-4 py-2 text-center text-xs font-bold text-gray-700 uppercase tracking-wider w-[140px] border border-border whitespace-nowrap"
            >
              등록일
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {items.map((item) => {
            // 패키지 정보 추출
            const pkg = packages.find((p) => p.name === item.packaging);
            const unit = Number(pkg?.unit || item.unit || 1);
            const packagingCost = Number(pkg?.cost || 0);
            // region/spec별 최신 공시가 추출
            const regionPrices = prices.filter((p) => p.region === region);
            let latestPrice = undefined;
            let latestDate = "";
            for (const price of regionPrices) {
              if (!latestDate || price.date > latestDate) {
                latestDate = price.date;
                latestPrice = price;
              }
            }
            let official = 0;
            if (latestPrice) {
              if (item.spec === "왕란") official = latestPrice.king;
              else if (item.spec === "특란") official = latestPrice.extraLarge;
              else if (item.spec === "대란") official = latestPrice.large;
              else if (item.spec === "중란") official = latestPrice.medium;
              else if (item.spec === "소란") official = latestPrice.small;
            }
            // 자동계산 단가
            const autoPrice = (official + packagingCost) * unit;
            // 표시할 단가
            const displayPrice =
              item.priceInputType === "manual" && item.manualPrice !== undefined
                ? item.manualPrice
                : autoPrice;
            // priceDiff: manualPrice와 autoPrice의 차이
            const priceDiff =
              item.priceInputType === "manual" && item.manualPrice !== undefined
                ? item.manualPrice - autoPrice
                : 0;
            return (
              <tr
                key={item.id}
                className={selectedItemIds.has(item.id) ? "bg-blue-100" : ""}
              >
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 text-center border border-border">
                  <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    checked={selectedItemIds.has(item.id)}
                    onChange={(e) => handleRowCheckboxChange(e, item.id)}
                    aria-label={`Select item ${item.name}`}
                  />
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 text-center border border-border">
                  {item.code}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 border border-border">
                  {item.name}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 text-center border border-border">
                  {item.spec}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 text-center border border-border">
                  {item.packaging}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 text-center border border-border">
                  {item.unit}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 text-right border border-border">
                  {displayPrice.toLocaleString()}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 text-center border border-border">
                  {priceDiff !== 0 ? priceDiff.toLocaleString() : "-"}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 text-center border border-border">
                  {item.modifiedDate}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 text-center border border-border">
                  {item.createdDate}
                </td>
              </tr>
            );
          })}
          {/* Display a message if there are no items */}
          {items.length === 0 && (
            <tr>
              <td
                colSpan={11}
                className="px-6 py-4 text-center text-sm text-gray-500"
              >
                표시할 품목이 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ItemTable; // default export 추가
