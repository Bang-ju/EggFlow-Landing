import React from "react";
import Draggable from "react-draggable";
import { GrayButton } from "@/components/ui/button";
import { useOfficialPriceStore } from "../../store/officialPriceStore";

interface OfficialPriceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  // 추가적인 props (e.g., 데이터 로딩 상태) 필요시 정의
}

const OfficialPriceDialog: React.FC<OfficialPriceDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const nodeRef = React.useRef<HTMLDivElement>(null);
  const prices = useOfficialPriceStore((state) => state.prices);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500/50 flex justify-center items-center z-50">
      <Draggable
        nodeRef={nodeRef as React.RefObject<HTMLElement>}
        handle=".draggable-handle"
      >
        <div
          ref={nodeRef}
          className="bg-gray-50 rounded-lg shadow-xl w-full max-w-3xl cursor-move"
        >
          <div className="px-6 py-3 border-b border-gray-200 flex justify-between items-center draggable-handle">
            <h2 className="text-lg font-semibold text-gray-800">공시가</h2>
            <GrayButton onClick={onClose}>X</GrayButton>
          </div>

          <div className="p-6">
            <div className="border border-gray-200 rounded overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-4 py-2 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                      지역
                    </th>
                    <th className="px-4 py-2 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                      날짜
                    </th>
                    <th className="px-4 py-2 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                      왕란
                    </th>
                    <th className="px-4 py-2 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                      특란
                    </th>
                    <th className="px-4 py-2 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                      대란
                    </th>
                    <th className="px-4 py-2 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                      중란
                    </th>
                    <th className="px-4 py-2 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                      소란
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {prices.map((price) => (
                    <tr
                      key={price.region + price.date}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-center text-gray-900">
                        {price.region}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-center text-gray-500">
                        {price.date}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-center text-gray-500">
                        {price.king.toLocaleString()}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-center text-gray-500">
                        {price.extraLarge.toLocaleString()}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-center text-gray-500">
                        {price.large.toLocaleString()}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-center text-gray-500">
                        {price.medium.toLocaleString()}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-center text-gray-500">
                        {price.small.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Draggable>
    </div>
  );
};

export { OfficialPriceDialog };
