import { BlueButton, GreenButton } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSalesStore } from "@/store/salesStore";
import { useCustomerStore } from "@/store/customerStore";
import { usePaymentStore } from "@/store/paymentStore";
import type { Sale } from "@/store/salesStore";
import { useState } from "react";

interface PaymentModalProps {
  saleId: string;
  visible: boolean;
  onClose: () => void;
}

const PaymentModal = ({ saleId, visible, onClose }: PaymentModalProps) => {
  const [paymentAmount, setPaymentAmount] = useState(0);

  const sales: Sale[] = useSalesStore((state) => state.sales);
  const sale = sales.find((s) => s.id === saleId);

  const customer = useCustomerStore((state) => state.customers).find(
    (c) => c.id.toString() === sale?.customerId
  );

  // 입금내역 zustand에서 가져오기
  const payments = usePaymentStore((state) => state.payments).filter(
    (p) => p.saleId === saleId
  );
  const addPayment = usePaymentStore((state) => state.addPayment);
  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
  const remain = (sale?.totalAmount || 0) - totalPaid;

  // 입금 저장 버튼 클릭 핸들러
  const handleSavePayment = () => {
    addPayment({
      id: String(Date.now()),
      date: new Date().toISOString().slice(0, 10),
      customerId: customer?.id.toString() || "", // 실제 선택값으로 교체 필요
      amount: paymentAmount,
      method: "현금", // 예시
      memo: "",
      saleId: sale?.id || "", // 실제 전표번호로 교체 필요
    });
    setPaymentAmount(0);
  };

  if (!visible) return null;
  if (!sale || !saleId)
    return (
      <div className="fixed inset-0 bg-gray-500/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-md w-[600px] max-w-[90%]">
          <div className="border-b p-4">
            <h3 className="font-bold">입금 등록</h3>
          </div>
          <div>
            <div className="p-4 bg-yellow-50 border border-yellow-400 text-yellow-700 text-sm rounded mb-4">
              매출전표 내용을 저장해주세요.
            </div>
          </div>
          <div className="border-t p-4 flex justify-end">
            <BlueButton onClick={onClose}>확인</BlueButton>
          </div>
        </div>
      </div>
    );

  return (
    <div className="fixed inset-0 bg-gray-500/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-md w-[600px] max-w-[90%]">
        <div className="border-b p-4">
          <h3 className="font-bold">입금 등록</h3>
        </div>
        {/* 데모 모드 알림 */}
        <div className="p-4 bg-yellow-50 border border-yellow-400 text-yellow-700 text-sm rounded mb-4">
          🚧 현재 개발 중인 기능입니다. 데모 환경에서는 사용할 수 없습니다.
        </div>
        <div className="p-6 space-y-6">
          <div className="flex flex-col space-y-3">
            <div className="flex justify-between">
              <div className="font-medium">매출전표</div>
              <div className="border rounded p-2 w-64 text-gray-500">
                {sale?.id}
              </div>
            </div>
            <div className="flex justify-between">
              <div className="font-medium">거래처</div>
              <div className="border rounded p-2 w-64 text-gray-500">
                {customer?.name}
              </div>
            </div>
            <div className="flex justify-between">
              <div className="font-medium">총거래액</div>
              <div className="border rounded p-2 w-64 text-right">
                ₩{sale?.totalAmount.toLocaleString()}
              </div>
            </div>
            <div className="flex justify-between">
              <div className="font-medium">현 입금액</div>
              <div className="border rounded p-2 w-64 text-right">
                ₩{totalPaid.toLocaleString()}
              </div>
            </div>
            <div className="flex justify-between">
              <div className="font-medium">잔금</div>
              <div className="border rounded p-2 w-64 text-right text-red-600">
                ₩{remain.toLocaleString()}
              </div>
            </div>
            <div className="flex justify-end">
              <GreenButton onClick={() => setPaymentAmount(remain)}>
                잔금 전체 입력
              </GreenButton>
            </div>
            <div className="flex justify-between">
              <div className="font-medium">입금액</div>
              <div className="flex flex-row gap-2">
                <Input
                  type="number"
                  className="w-32 sm:text-sm text-right"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                />
                <GreenButton onClick={handleSavePayment}>입금 저장</GreenButton>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-2">입금내역</h4>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border p-2 text-center text-sm font-bold">
                    연번
                  </th>
                  <th className="border p-2 text-center text-sm font-bold">
                    입금일
                  </th>
                  <th className="border p-2 text-center text-sm font-bold">
                    입금액
                  </th>
                  <th className="border p-2 text-center text-sm font-bold">
                    입금 후 잔액
                  </th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p, idx) => {
                  const paidSum = payments
                    .slice(0, idx + 1)
                    .reduce((sum, pay) => sum + pay.amount, 0);
                  const remainAfter = (sale?.totalAmount || 0) - paidSum;
                  return (
                    <tr key={p.id} className="bg-gray-100 text-sm">
                      <td className="border p-2 text-center">{idx + 1}</td>
                      <td className="border p-2 text-center">{p.date}</td>
                      <td className="border p-2 text-right">
                        ₩{p.amount.toLocaleString()}
                      </td>
                      <td className="border p-2 text-right text-red-600">
                        ₩{remainAfter.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
                {payments.length > 0 && (
                  <tr className="bg-gray-50 font-bold text-sm">
                    <td colSpan={2} className="border p-2 text-center">
                      계
                    </td>
                    <td className="border p-2 text-right">
                      ₩{totalPaid.toLocaleString()}
                    </td>
                    <td className="border p-2 text-right text-red-600">
                      ₩{remain.toLocaleString()}
                    </td>
                  </tr>
                )}
                {payments.length === 0 && (
                  <tr className="bg-gray-50 text-sm">
                    <td
                      colSpan={4}
                      className="border p-2 text-center text-gray-400"
                    >
                      입금 내역이 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="border-t p-4 flex justify-end">
          <BlueButton onClick={onClose}>확인</BlueButton>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
