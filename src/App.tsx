import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { pageinfo } from "@/pages/pageinfo";
import { Sidebar } from "@/components/layout/sidebar";
import { useEffect } from "react";
import { useStockStore } from "./store/stockStore";
import { useItemStore } from "./store/itemStore";
import { usePurchaseStore } from "./store/purchaseStore";
import { useSalesStore } from "./store/salesStore";
import { useCustomerStore } from "./store/customerStore";
import { usePaymentStore } from "./store/paymentStore";
import { Customer } from "./types/customer";

// 모든 경로를 포함하는 라우트 배열을 생성하는 함수
const getAllRoutes = () => {
  const routes: {
    path: string;
    title: string;
    component: React.ReactNode;
  }[] = [];

  pageinfo.forEach((page) => {
    // 서브메뉴가 있는 경우 서브메뉴의 모든 경로 추가
    if (page.submenu && page.submenu.length > 0) {
      page.submenu.forEach((subItem) => {
        if (subItem.path) {
          routes.push({
            path: subItem.path,
            title: `${page.title} > ${subItem.title}`,
            component: subItem.component || <div>빈 페이지</div>,
          });
        }
      });
    }
  });

  return routes;
};

function App() {
  const routes = getAllRoutes();

  useEffect(() => {
    const items = useItemStore.getState().items;
    useStockStore.getState().initStocks(items);
  }, []);

  // 매입/매출 변동 시 재고 동기화
  const purchases = usePurchaseStore((state) => state.purchases);
  const sales = useSalesStore((state) => state.sales);
  useEffect(() => {
    // 1. 모든 아이템별 egg 재고 0으로 초기화
    const items = useItemStore.getState().items;
    const stockMap: Record<string, number> = {};
    items.forEach((item) => {
      stockMap[item.id] = 0;
    });
    // 2. 매입: egg 수량만큼 더함
    purchases.forEach((purchase) => {
      purchase.items.forEach((item) => {
        stockMap[item.itemId] =
          (stockMap[item.itemId] || 0) + (item.quantityEgg || 0);
      });
    });
    // 3. 매출: egg 수량만큼 뺌
    sales.forEach((sale) => {
      sale.items.forEach((item) => {
        stockMap[item.itemId] =
          (stockMap[item.itemId] || 0) - (item.quantityEgg || 0);
      });
    });
    // 4. setStocks로 일괄 반영
    const newStocks = Object.entries(stockMap).map(([itemId, quantityEgg]) => ({
      itemId,
      quantityEgg,
    }));
    useStockStore.getState().setStocks(newStocks);
  }, [purchases, sales]);

  const payments = usePaymentStore((state) => state.payments);
  const customers = useCustomerStore((state) => state.customers);
  const updateCustomer = useCustomerStore((state) => state.updateCustomer);

  // 거래 변경시 거래처 잔금, 총 거래액 변경
  useEffect(() => {
    customers.forEach((customer) => {
      const totalTransaction = sales
        .filter((s) => s.customerId === customer.id.toString())
        .reduce((sum, sale) => sum + sale.totalAmount, 0);

      const balance = payments
        .filter((p) => p.customerId === customer.id.toString())
        .reduce((sum, payment) => sum + payment.amount, 0);

      updateCustomer({
        ...customer,
        totalTransaction,
        balance: totalTransaction - balance,
      });
    });
  }, [sales]);

  // payment 변경시 거래처 잔금 변경
  useEffect(() => {
    customers.forEach((customer: Customer) => {
      const balance = payments
        .filter((p) => p.customerId === customer.id.toString())
        .reduce((sum, payment) => sum + payment.amount, 0);

      updateCustomer({
        ...customer,
        balance: customer.totalTransaction - balance,
      });
    });
  }, [payments]);
  return (
    <Router>
      <div className="flex h-screen w-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto p-6 bg-[#F7F5F0]">
          <Routes>
            {routes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.component}
              />
            ))}
            <Route
              path="/"
              element={<div className="p-4 border rounded-lg">홈 페이지</div>}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
