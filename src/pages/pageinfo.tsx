import { Users, Inbox, Box, Archive, Briefcase, PieChart } from "lucide-react";
import { Page } from "@/types/page";
import { UserMain } from "./user";
import { PurchasePage } from "./purchase";
import { StockPage } from "./stock";
import { SalesPage } from "./sales";
import { ItemListPage } from "./items";
import PackagePage from "./package";
import PricePage from "./price";
import CustomerPage from "./customer";
import { OrderPage } from "./order";
import { StatisticPage } from "./statistic/main";
import ReportPage from "./report";

export const pageinfo: Page[] = [
  {
    title: "사용자 관리",
    icon: <Users width={20} height={20} />,
    submenu: [
      {
        title: "사업자 관리",
        path: "/user",
        component: <UserMain />,
      },
    ],
  },
  {
    title: "매입 관리",
    icon: <Inbox width={20} height={20} />,
    submenu: [
      {
        title: "매입 목록",
        path: "/purchase",
        component: <PurchasePage />,
      },
      {
        title: "발주서 목록",
        path: "/purchase/order",
        component: <OrderPage />,
      },
      {
        title: "재고 관리",
        path: "/purchase/stock",
        component: <StockPage />,
      },
    ],
  },
  {
    title: "매출 관리",
    icon: <Box width={20} height={20} />,
    submenu: [
      {
        title: "매출 목록",
        path: "/sales",
        component: <SalesPage />,
      },
    ],
  },
  {
    title: "품목 관리",
    icon: <Archive width={20} height={20} />,
    submenu: [
      {
        title: "품목 등록/수정",
        path: "/item",
        component: <ItemListPage />,
      },
      {
        title: "포장 관리",
        path: "/item/package",
        component: <PackagePage />,
      },
    ],
  },
  {
    title: "거래처 관리",
    icon: <Briefcase width={20} height={20} />,
    submenu: [
      {
        title: "거래처 목록",
        path: "/customer",
        component: <CustomerPage />,
      },
      {
        title: "거래처별 단가 관리",
        path: "/customer/price",
        component: <PricePage />,
      },
    ],
  },
  {
    title: "통계",
    icon: <PieChart width={20} height={20} />,
    submenu: [
      {
        title: "지표 분석",
        path: "/statistic",
        component: <StatisticPage />,
      },
      {
        title: "분석 보고서 조회",
        path: "/statistics/report",
        component: <ReportPage />,
      },
    ],
  },
];
