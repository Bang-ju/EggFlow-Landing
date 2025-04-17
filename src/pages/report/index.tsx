import { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";

Chart.register(...registerables, annotationPlugin);

export default function Report() {
  // 차트 인스턴스 ref 선언
  const priceTrendChartRef = useRef<Chart | null>(null);
  const regionalPriceChartRef = useRef<Chart | null>(null);
  const nrrChartRef = useRef<Chart | null>(null);
  const clvChartRef = useRef<Chart | null>(null);
  const customer1ChartRef = useRef<Chart | null>(null);
  const customer2ChartRef = useRef<Chart | null>(null);

  useEffect(() => {
    // Price Trend Chart
    const priceTrendCanvas = document.getElementById(
      "priceTrendChart"
    ) as HTMLCanvasElement | null;
    const priceTrendCtx = priceTrendCanvas?.getContext("2d");
    if (priceTrendCtx) {
      if (priceTrendChartRef.current) {
        priceTrendChartRef.current.destroy();
      }
      priceTrendChartRef.current = new Chart(priceTrendCtx, {
        type: "line",
        data: {
          labels: [
            "2025 W6",
            "W7",
            "W8",
            "W9",
            "W10",
            "W11",
            "W12",
            "W13",
            "W14",
          ],
          datasets: [
            {
              label: "전국 평균 가격 (특란 30구, 원)",
              data: [5200, 5300, 5400, 5500, 5600, 5700, 5800, 5700, 5450],
              backgroundColor: "rgba(255, 209, 102, 0.2)",
              borderColor: "rgba(255, 209, 102, 1)",
              borderWidth: 2,
              tension: 0.3,
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  return (
                    context.dataset.label +
                    ": " +
                    context.parsed.y.toLocaleString() +
                    "원"
                  );
                },
              },
            },
          },
          scales: {
            y: {
              beginAtZero: false,
              ticks: {
                callback: function (value) {
                  return value.toLocaleString() + "원";
                },
              },
            },
          },
        },
      });
    }

    // Regional Price Chart
    const regionalPriceCanvas = document.getElementById(
      "regionalPriceChart"
    ) as HTMLCanvasElement | null;
    const regionalPriceCtx = regionalPriceCanvas?.getContext("2d");
    if (regionalPriceCtx) {
      if (regionalPriceChartRef.current) {
        regionalPriceChartRef.current.destroy();
      }
      regionalPriceChartRef.current = new Chart(regionalPriceCtx, {
        type: "bar",
        data: {
          labels: [
            "경기",
            "충청",
            "강원",
            "경북(영주)",
            "전북",
            "전남",
            "경남*",
            "경북*",
          ],
          datasets: [
            {
              label: "지역별 가격 (4/1 기준, 원)",
              data: [5400, 5400, 5400, 5400, 5550, 5340, 5940, 5940],
              backgroundColor: [
                "rgba(255, 209, 102, 0.7)",
                "rgba(255, 209, 102, 0.7)",
                "rgba(255, 209, 102, 0.7)",
                "rgba(255, 209, 102, 0.7)",
                "rgba(255, 209, 102, 0.7)",
                "rgba(255, 209, 102, 0.7)",
                "rgba(212, 163, 115, 0.7)",
                "rgba(212, 163, 115, 0.7)",
              ],
              borderColor: [
                "rgba(255, 209, 102, 1)",
                "rgba(255, 209, 102, 1)",
                "rgba(255, 209, 102, 1)",
                "rgba(255, 209, 102, 1)",
                "rgba(255, 209, 102, 1)",
                "rgba(255, 209, 102, 1)",
                "rgba(212, 163, 115, 1)",
                "rgba(212, 163, 115, 1)",
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  return context.parsed.y.toLocaleString() + "원";
                },
              },
            },
            annotation: {
              annotations: {
                line1: {
                  type: "line",
                  yMin: 5450,
                  yMax: 5450,
                  borderColor: "rgb(255, 99, 132)",
                  borderWidth: 2,
                  borderDash: [6, 6],
                  label: {
                    content: "전국 평균",
                    display: true,
                    position: "end",
                  },
                },
              },
            },
          },
          scales: {
            y: {
              beginAtZero: false,
              min: 5000,
              ticks: {
                callback: function (value) {
                  return value.toLocaleString() + "원";
                },
              },
            },
          },
        },
      });
    }

    // NRR Chart
    const nrrCanvas = document.getElementById(
      "nrrChart"
    ) as HTMLCanvasElement | null;
    const nrrCtx = nrrCanvas?.getContext("2d");
    if (nrrCtx) {
      if (nrrChartRef.current) {
        nrrChartRef.current.destroy();
      }
      nrrChartRef.current = new Chart(nrrCtx, {
        type: "doughnut",
        data: {
          labels: ["NRR 98%", "손실 2%"],
          datasets: [
            {
              data: [98, 2],
              backgroundColor: [
                "rgba(255, 209, 102, 0.7)",
                "rgba(212, 163, 115, 0.7)",
              ],
              borderColor: ["rgba(255, 209, 102, 1)", "rgba(212, 163, 115, 1)"],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "bottom",
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  return context.label + ": " + context.raw + "%";
                },
              },
            },
          },
        },
      });
    }

    // CLV Chart
    const clvCanvas = document.getElementById(
      "clvChart"
    ) as HTMLCanvasElement | null;
    const clvCtx = clvCanvas?.getContext("2d");
    if (clvCtx) {
      if (clvChartRef.current) {
        clvChartRef.current.destroy();
      }
      clvChartRef.current = new Chart(clvCtx, {
        type: "line",
        data: {
          labels: ["2024 Q1", "Q2", "Q3", "Q4", "2025 Q1"],
          datasets: [
            {
              label: "주요 거래처 평균 CLV (만원)",
              data: [1200, 1250, 1300, 1400, 1500],
              backgroundColor: "rgba(255, 209, 102, 0.2)",
              borderColor: "rgba(255, 209, 102, 1)",
              borderWidth: 2,
              tension: 0.3,
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  return (
                    context.dataset.label +
                    ": " +
                    context.parsed.y.toLocaleString() +
                    "만원"
                  );
                },
              },
            },
          },
          scales: {
            y: {
              beginAtZero: false,
              min: 1000,
              ticks: {
                callback: function (value) {
                  return value.toLocaleString() + "만원";
                },
              },
            },
          },
        },
      });
    }

    // Customer 1 Chart
    const customer1Canvas = document.getElementById(
      "customer1Chart"
    ) as HTMLCanvasElement | null;
    const customer1Ctx = customer1Canvas?.getContext("2d");
    if (customer1Ctx) {
      if (customer1ChartRef.current) {
        customer1ChartRef.current.destroy();
      }
      customer1ChartRef.current = new Chart(customer1Ctx, {
        type: "bar",
        data: {
          labels: [
            "2024.10",
            "2024.11",
            "2024.12",
            "2025.1",
            "2025.2",
            "2025.3",
          ],
          datasets: [
            {
              label: "거래 빈도 (회/월)",
              data: [4.2, 4.1, 4.0, 3.9, 3.8, 3.8],
              backgroundColor: "rgba(239, 71, 111, 0.7)",
              borderColor: "rgba(239, 71, 111, 1)",
              borderWidth: 1,
              yAxisID: "y",
            },
            {
              label: "평균 거래 금액 (만원)",
              data: [120, 122, 121, 120, 119, 120],
              backgroundColor: "rgba(6, 214, 160, 0.7)",
              borderColor: "rgba(6, 214, 160, 1)",
              borderWidth: 1,
              type: "line",
              yAxisID: "y1",
            },
            {
              label: "거래 품목 수 (종)",
              data: [5, 5, 4, 4, 3, 3],
              backgroundColor: "rgba(255, 209, 102, 0.7)",
              borderColor: "rgba(255, 209, 102, 1)",
              borderWidth: 1,
              yAxisID: "y",
            },
          ],
        },
        options: {
          responsive: true,
          interaction: {
            mode: "index",
            intersect: false,
          },
          plugins: {
            legend: {
              position: "top",
            },
          },
          scales: {
            y: {
              type: "linear",
              display: true,
              position: "left",
              title: {
                display: true,
                text: "거래 빈도/품목 수",
              },
            },
            y1: {
              type: "linear",
              display: true,
              position: "right",
              title: {
                display: true,
                text: "평균 거래 금액 (만원)",
              },
              grid: {
                drawOnChartArea: false,
              },
            },
          },
        },
      });
    }

    // Customer 2 Chart
    const customer2Canvas = document.getElementById(
      "customer2Chart"
    ) as HTMLCanvasElement | null;
    const customer2Ctx = customer2Canvas?.getContext("2d");
    if (customer2Ctx) {
      if (customer2ChartRef.current) {
        customer2ChartRef.current.destroy();
      }
      customer2ChartRef.current = new Chart(customer2Ctx, {
        type: "bar",
        data: {
          labels: [
            "2024.10",
            "2024.11",
            "2024.12",
            "2025.1",
            "2025.2",
            "2025.3",
          ],
          datasets: [
            {
              label: "거래 빈도 (회/월)",
              data: [4, 4, 4, 4, 4, 4],
              backgroundColor: "rgba(239, 71, 111, 0.7)",
              borderColor: "rgba(239, 71, 111, 1)",
              borderWidth: 1,
              yAxisID: "y",
            },
            {
              label: "평균 거래 금액 (만원)",
              data: [150, 152, 155, 158, 170, 172],
              backgroundColor: "rgba(6, 214, 160, 0.7)",
              borderColor: "rgba(6, 214, 160, 1)",
              borderWidth: 1,
              type: "line",
              yAxisID: "y1",
            },
            {
              label: "중란 비중 (%)",
              data: [20, 22, 25, 28, 45, 50],
              backgroundColor: "rgba(255, 209, 102, 0.7)",
              borderColor: "rgba(255, 209, 102, 1)",
              borderWidth: 1,
              yAxisID: "y2",
            },
          ],
        },
        options: {
          responsive: true,
          interaction: {
            mode: "index",
            intersect: false,
          },
          plugins: {
            legend: {
              position: "top",
            },
          },
          scales: {
            y: {
              type: "linear",
              display: true,
              position: "left",
              title: {
                display: true,
                text: "거래 빈도",
              },
            },
            y1: {
              type: "linear",
              display: true,
              position: "right",
              title: {
                display: true,
                text: "평균 거래 금액 (만원)",
              },
              grid: {
                drawOnChartArea: false,
              },
            },
            y2: {
              type: "linear",
              display: true,
              position: "right",
              title: {
                display: true,
                text: "중란 비중 (%)",
              },
              min: 0,
              max: 100,
              grid: {
                drawOnChartArea: false,
              },
            },
          },
        },
      });
    }

    // cleanup: 모든 차트 destroy
    return () => {
      if (priceTrendChartRef.current) {
        priceTrendChartRef.current.destroy();
        priceTrendChartRef.current = null;
      }
      if (regionalPriceChartRef.current) {
        regionalPriceChartRef.current.destroy();
        regionalPriceChartRef.current = null;
      }
      if (nrrChartRef.current) {
        nrrChartRef.current.destroy();
        nrrChartRef.current = null;
      }
      if (clvChartRef.current) {
        clvChartRef.current.destroy();
        clvChartRef.current = null;
      }
      if (customer1ChartRef.current) {
        customer1ChartRef.current.destroy();
        customer1ChartRef.current = null;
      }
      if (customer2ChartRef.current) {
        customer2ChartRef.current.destroy();
        customer2ChartRef.current = null;
      }
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="egg-yolk p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                주간 계란 시장 동향 리포트
              </h1>
              <p className="text-gray-700 mt-2">
                <i className="fas fa-calendar-alt mr-2"></i>발행일: 2025년 4월
                4일 (금) 16:13 KST (2025년 14주차)
              </p>
              <p className="text-gray-700">
                <i className="fas fa-users mr-2"></i>대상: 계란 유통 파트너사
              </p>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <img
                src="https://img.icons8.com/color/48/000000/chicken.png"
                alt="Egg Icon"
                className="w-12 h-12"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className="egg-yolk p-2 rounded-full mr-3">
              <i className="fas fa-star text-white text-lg"></i>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              Executive Summary: 금주의 핵심
            </h2>
          </div>
          <div className="bg-egg-white p-4 rounded-lg border-l-4 border-egg-brown">
            <p className="text-gray-700 italic">
              이번 주는 전주(3월 말) 대비 일부 지역에서 계란 가격이 하락하며
              전국 평균가(특란 30구)는 5,450원 수준입니다. 4/1 기준 경기, 충청,
              강원은 5,400원대로 안정세를 보이고 있으며,
              <span className="font-bold">전북(5,550원)</span>은 상대적으로 높고
              <span className="font-bold">전남(5,340원)</span>은 다소 낮은
              수준을 보이고 있습니다. 경상권은 3/26 데이터 기준 5,940원으로,
              현재는 타 지역 추세를 고려할 때 조정이 있었을 것으로 예상됩니다.
              공급은 전반적으로 안정적이나 사료비 상승 압박이 지속되고 있습니다.
              해외 동향도 주목할 필요가 있습니다. 전체 거래처
              <span className="font-bold">NRR은 98%</span> 수준입니다.
            </p>
          </div>
        </div>
      </div>

      {/* Price Trend */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className="egg-yolk p-2 rounded-full mr-3">
              <i className="fas fa-chart-line text-white text-lg"></i>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              1. 가격 동향 분석
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Price Summary */}
            <div className="bg-egg-white p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                📈 전국 평균 가격 (특란 30구 도매)
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">금주 평균:</span>
                  <span className="font-bold">5,450원</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">전주 대비:</span>
                  <div>
                    <span className="tag-down mr-2">▼ 240원 (-4.2%)</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">전년 동기 대비:</span>
                  <div>
                    <span className="tag-up mr-2">▲ 230원 (+4.4%)</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                *(참고: 파트너사 제공 데이터, 축평원, 자체 시장 조사 종합)*
              </p>
            </div>

            {/* Regional Price */}
            <div className="bg-egg-white p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                🗺️ 주요 지역별 시세 (특란 30구 도매, 원)
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        지역
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        기준일
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        가격
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        전주대비
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                        경기
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                        4/1
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                        5,400
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <span className="tag-down">▼</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                        충청
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                        4/1
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                        5,400
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <span className="tag-down">▼</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                        강원
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                        4/1
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                        5,400
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <span className="tag-down">▼</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                        경북(영주)
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                        4/1
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                        5,400
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <span className="tag-down">▼</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                        전북
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                        4/1
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                        5,550
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <span className="tag-down">▼</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                        전남
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                        4/1
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                        5,340
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <span className="tag-down">▼</span>
                      </td>
                    </tr>
                    <tr className="bg-yellow-50">
                      <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                        경남
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                        3/26
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                        5,940
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <span className="tag-neutral">N/A</span>
                      </td>
                    </tr>
                    <tr className="bg-yellow-50">
                      <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                        경북
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                        3/26
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                        5,940
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <span className="tag-neutral">N/A</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                *(참고: 가격은 제공 데이터를 특란 30구 기준으로 환산. WoW는 전주
                대비 방향성 추정)*
              </p>
            </div>
          </div>

          {/* Regional Analysis */}
          <div className="bg-egg-white p-4 rounded-lg mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              지역별 시세 분석:
            </h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>
                4/1 기준, 수도권 및 중부권(경기, 충청, 강원)과 경북(영주)이
                <span className="font-bold">5,400원 선으로 동조화</span>되는
                모습입니다.
              </li>
              <li>
                <span className="font-bold">
                  호남권 내에서는 전북이 강세, 전남이 약세
                </span>
                를 보이며 가격 차이가 발생했습니다.
              </li>
              <li>
                <span className="font-bold">경상권은 3/26 데이터만 확보</span>
                되어 직접 비교는 어렵지만, 타 지역의 4/1 가격 하락세를 고려할 때
                <span className="font-bold">
                  현재는 5,400원 ~ 5,600원 수준으로 하락했을 가능성
                </span>
                을 염두에 두어야 합니다 (현장 확인 필요).
              </li>
            </ul>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Price Trend Chart */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                전국 평균 가격 추이 (최근 8주)
              </h3>
              <div className="chart-container">
                <canvas
                  id="priceTrendChart"
                  style={{
                    display: "block",
                    boxSizing: "border-box",
                    height: "181px",
                    width: "362px",
                  }}
                  width="724"
                  height="362"
                ></canvas>
              </div>
            </div>

            {/* Regional Price Chart */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                지역별 가격 비교 (4/1 기준)
              </h3>
              <div className="chart-container">
                <canvas
                  id="regionalPriceChart"
                  style={{
                    display: "block",
                    boxSizing: "border-box",
                    height: "181px",
                    width: "362px",
                  }}
                  width="724"
                  height="362"
                ></canvas>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Supply & Demand */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Supply */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <div className="egg-yolk p-2 rounded-full mr-3">
                <i className="fas fa-truck text-white text-lg"></i>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                SUPPLY: 공급 동향
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-start">
                <div className="mr-3 mt-1 text-red-500">
                  <i className="fas fa-exclamation-triangle"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">
                    조류인플루엔자(AI) 동향:
                  </h3>
                  <p className="text-gray-700">
                    고병원성 AI 확진 <span className="font-bold">없음</span>.
                    산발적 의심 신고 조사 중. 정부
                    <span className="font-bold">특별 방역 대책 지속</span>. AI
                    발생 위험은 상존하므로
                    <span className="font-bold">상시 경계 필수</span>.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="mr-3 mt-1 text-green-500">
                  <i className="fas fa-check-circle"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">계란 생산량:</h3>
                  <p className="text-gray-700">
                    전국 일일 생산량 약
                    <span className="font-bold">4,580만 개</span> 수준으로
                    <span className="font-bold">전월 대비 소폭 감소</span>.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="mr-3 mt-1 text-yellow-500">
                  <i className="fas fa-chart-line"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">
                    생산 비용 (사료비):
                  </h3>
                  <p className="text-gray-700">
                    국제 곡물가 및 환율 영향으로 배합사료 가격
                    <span className="font-bold">소폭 상승 압력 지속</span>.
                    (정부 사료구매자금 지원 연장 검토 중 - 뉴스 섹션 참조)
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="mr-3 mt-1 text-gray-500">
                  <i className="fas fa-minus"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">계란 수입:</h3>
                  <p className="text-gray-700">
                    현재 <span className="font-bold">큰 변동 없음</span>. 국내
                    가격 급등 시 정부 개입 가능성 존재.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-egg-white p-4 rounded-lg mt-4">
              <p className="text-gray-700 italic">
                <span className="font-bold">공급 요약:</span> 전반적인 공급량은
                안정적이나, AI 방역 및 사료비 변동성은 지속적인 관리
                포인트입니다.
              </p>
            </div>
          </div>
        </div>

        {/* Demand */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <div className="egg-yolk p-2 rounded-full mr-3">
                <i className="fas fa-shopping-cart text-white text-lg"></i>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                DEMAND: 수요 동향
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-start">
                <div className="mr-3 mt-1 text-green-500">
                  <i className="fas fa-check-circle"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">소매 채널:</h3>
                  <p className="text-gray-700">
                    가정 내 소비 <span className="font-bold">꾸준</span>. 물가
                    부담 속 <span className="font-bold">가성비 식재료</span>로
                    수요 안정.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="mr-3 mt-1 text-green-500">
                  <i className="fas fa-check-circle"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">
                    외식/가공 채널:
                  </h3>
                  <p className="text-gray-700">
                    급식 및 외식 경기 회복세로
                    <span className="font-bold">수요 점진적 증가</span>. 가공용
                    수요도 안정적.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="mr-3 mt-1 text-blue-500">
                  <i className="fas fa-lightbulb"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">
                    소비자 트렌드:
                  </h3>
                  <p className="text-gray-700">
                    <span className="font-bold">동물복지/가치 소비</span> 경향
                    꾸준.
                    <span className="font-bold">식물성 대체 계란</span> 등 신규
                    상품 등장 (뉴스 섹션 참조).
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-egg-white p-4 rounded-lg mt-4">
              <p className="text-gray-700 italic">
                <span className="font-bold">수요 요약:</span> 소매/외식 수요
                모두 안정적이며, 장기적으로 가치 소비 및 대체재 트렌드에 주목할
                필요가 있습니다.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* News */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className="egg-yolk p-2 rounded-full mr-3">
              <i className="fas fa-newspaper text-white text-lg"></i>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              주요 시장 뉴스 &amp; 해외 동향
            </h2>
          </div>

          <div className="space-y-6">
            {/* News 1 */}
            <div className="border-l-4 border-red-400 pl-4 py-2">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-gray-800">
                  미국 중서부, 조류독감 발생으로 계란 가격 상승세 (Reuters,
                  2025.4.3)
                </h3>
                <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                  주요
                </span>
              </div>
              <p className="text-gray-700 mt-1">
                <span className="font-bold">Summary:</span> 미국 아이오와주
                양계장 조류독감 발생으로 현지 계란 가격 7% 상승.
              </p>
              <p className="text-gray-700 mt-1">
                <span className="font-bold">영향:</span> 미국 내 계란 수급
                불안정 가능성. 국내 수입 계란 가격에 영향 예상.
              </p>
            </div>

            {/* News 2 */}
            <div className="border-l-4 border-green-400 pl-4 py-2">
              <h3 className="text-lg font-semibold text-gray-800">
                농식품부, 사료구매자금 지원 연장 검토 (농민신문, 2025.4.2)
              </h3>
              <p className="text-gray-700 mt-1">
                <span className="font-bold">Summary:</span> 농가 경영 안정을
                위한 사료구매자금 금리 인하(1.5%) 6개월 연장 검토.
              </p>
              <p className="text-gray-700 mt-1">
                <span className="font-bold">영향:</span> 연장 시 농가 사료비
                부담 완화 기대. 5월 중 최종 결정 예정.
              </p>
            </div>

            {/* News 3 */}
            <div className="border-l-4 border-blue-400 pl-4 py-2">
              <h3 className="text-lg font-semibold text-gray-800">
                푸드테크 기업 A사, 식물성 대체 계란 출시 (식품저널, 2025.4.1)
              </h3>
              <p className="text-gray-700 mt-1">
                <span className="font-bold">Summary:</span> 국내 스타트업,
                식물성 대체 계란 제품 출시. 대형마트 3사 입점 예정.
              </p>
              <p className="text-gray-700 mt-1">
                <span className="font-bold">영향:</span> 비건 시장 확대. 현재는
                제한적이나 장기적 시장 영향 모니터링 필요.
              </p>
            </div>

            {/* News 4 */}
            <div className="border-l-4 border-yellow-400 pl-4 py-2">
              <h3 className="text-lg font-semibold text-gray-800">
                브라질 남부 가뭄, 옥수수 작황 부진 (Bloomberg, 2025.4.4)
              </h3>
              <p className="text-gray-700 mt-1">
                <span className="font-bold">Summary:</span> 브라질 남부 강수량
                부족으로 2차 옥수수 작황 전년비 15% 감소 전망.
              </p>
              <p className="text-gray-700 mt-1">
                <span className="font-bold">영향:</span> 국제 옥수수 가격 상승 →
                사료 원가 상승 우려.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* KPI */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className="egg-yolk p-2 rounded-full mr-3">
              <i className="fas fa-chart-pie text-white text-lg"></i>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              핵심 성과 지표 (KPI) Insight (전체)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* NRR */}
            <div className="bg-egg-white p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                💰 Net Revenue Retention (NRR):
                <span className="text-2xl">98%</span>
              </h3>
              <p className="text-gray-700">
                <span className="font-bold">의미:</span> 기존 거래처 매출이 전년
                동기 대비 98% 수준으로 유지 (가격 변동 감안).
              </p>
              <div className="bg-white p-3 rounded-lg mt-3">
                <div className="chart-container">
                  <canvas
                    id="nrrChart"
                    style={{
                      display: "block",
                      boxSizing: "border-box",
                      height: "300px",
                      width: "300px",
                    }}
                    width="600"
                    height="600"
                  ></canvas>
                </div>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg mt-3">
                <p className="text-gray-700 italic">
                  <span className="font-bold">Insight:</span> 전체 고객 관계는
                  안정적이나, 개별 고객 분석을 통한 이탈 방지 및 성장 전략이
                  중요합니다.
                </p>
              </div>
            </div>

            {/* CLV */}
            <div className="bg-egg-white p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                💰 Customer Lifetime Value (CLV) - 주요 거래처 평균 (추정):
                <span className="text-2xl">1,500만원/년</span>
              </h3>
              <p className="text-gray-700">
                <span className="font-bold">의미:</span> 주요 거래처 1곳의 연간
                평균 총이익 가치.
              </p>
              <div className="bg-white p-3 rounded-lg mt-3">
                <div className="chart-container">
                  <canvas
                    id="clvChart"
                    style={{
                      display: "block",
                      boxSizing: "border-box",
                      height: "170px",
                      width: "340px",
                    }}
                    width="680"
                    height="340"
                  ></canvas>
                </div>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg mt-3">
                <p className="text-gray-700 italic">
                  <span className="font-bold">Insight:</span> 안정적 공급 능력과
                  신뢰 기반 파트너십이 CLV 극대화의 핵심입니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Analysis */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className="egg-yolk p-2 rounded-full mr-3">
              <i className="fas fa-user-tie text-white text-lg"></i>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              주요 거래처별 KPI 분석 (예시)
            </h2>
          </div>

          {/* Customer 1 */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              1) A 마트 (대형 리테일 - 수도권 중심)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-egg-white p-3 rounded-lg">
                <h4 className="font-semibold text-gray-700">NRR:</h4>
                <p className="text-2xl font-bold text-red-500">95%</p>
                <p className="text-sm text-gray-600">(▼ 5%p vs LY)</p>
              </div>
              <div className="bg-egg-white p-3 rounded-lg">
                <h4 className="font-semibold text-gray-700">거래 빈도:</h4>
                <p className="text-2xl font-bold text-red-500">3.8회/월</p>
                <p className="text-sm text-gray-600">(4.2회 → 3.8회)</p>
              </div>
              <div className="bg-egg-white p-3 rounded-lg">
                <h4 className="font-semibold text-gray-700">평균 거래 금액:</h4>
                <p className="text-2xl font-bold text-gray-800">유지</p>
                <p className="text-sm text-gray-600">큰 변동 없음</p>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg mb-4">
              <p className="text-gray-700 italic">
                <span className="font-bold">NRR 변동 사유 (추정):</span> 전년
                대비 판촉 부재, PB/경쟁사 약진 영향.
              </p>
            </div>

            <h4 className="font-semibold text-gray-800 mb-2">
              CLV 관련 주요 지표 추이 및 시사점:
            </h4>
            <ul className="list-disc pl-5 space-y-2 text-gray-700 mb-4">
              <li>
                <span className="font-bold">거래 빈도:</span> 최근 6개월간
                월평균 주문 횟수 <span className="font-bold">감소세</span>{" "}
                (4.2회 → 3.8회/월).
              </li>
              <li>
                <span className="font-bold">평균 거래 금액 (AOV):</span> 큰 변동
                없이 <span className="font-bold">유지</span> 상태.
              </li>
              <li>
                <span className="font-bold">거래 품목:</span> 기존 주력(특란,
                대란) 외
                <span className="font-bold">
                  기타 품목(예: 구운란, 소포장) 거래 비중 감소
                </span>
                추세.
              </li>
            </ul>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4">
              <h4 className="font-semibold text-gray-800 mb-3">
                📈 [A마트 거래빈도/AOV/품목수 추이 (최근 6개월)]
              </h4>
              <div className="chart-container">
                <canvas
                  id="customer1Chart"
                  style={{
                    display: "block",
                    boxSizing: "border-box",
                    height: "300px",
                    width: "600px",
                  }}
                  width="1200"
                  height="600"
                ></canvas>
              </div>
            </div>

            <div className="bg-egg-white p-4 rounded-lg">
              <p className="text-gray-700 italic">
                <span className="font-bold">시사점:</span> 거래 빈도와 품목
                다양성 감소는
                <span className="font-bold">
                  향후 거래 관계 약화 및 CLV 하락 가능성
                </span>
                을 시사합니다. 경쟁 심화 및 판촉 부재와 연관된 것으로 보이며,
                <span className="font-bold">관계 강화 및 거래 활성화 노력</span>
                이 필요한 시점입니다.
              </p>
            </div>

            <div className="mt-4">
              <h4 className="font-semibold text-gray-800 mb-2">
                ▶️ 대응 방안:
              </h4>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>
                  <span className="font-bold">정기 미팅:</span> 월 1회 판매 현황
                  점검 및 의견 청취
                </li>
                <li>
                  <span className="font-bold">판촉 제안:</span> 주말 특가전 등
                  매출 증대 방안 협의
                </li>
                <li>
                  <span className="font-bold">신규 상품:</span> 동물복지란,
                  소포장 제품 등 차별화 상품 제안
                </li>
              </ul>
            </div>
          </div>

          <div className="divider"></div>

          {/* Customer 2 */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              2) B 프랜차이즈 (주요 외식 채널 - 전국)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-egg-white p-3 rounded-lg">
                <h4 className="font-semibold text-gray-700">NRR:</h4>
                <p className="text-2xl font-bold text-green-500">103%</p>
                <p className="text-sm text-gray-600">(▲ 3%p vs LY)</p>
              </div>
              <div className="bg-egg-white p-3 rounded-lg">
                <h4 className="font-semibold text-gray-700">거래 빈도:</h4>
                <p className="text-2xl font-bold text-gray-800">1회/주</p>
                <p className="text-sm text-gray-600">안정적 유지</p>
              </div>
              <div className="bg-egg-white p-3 rounded-lg">
                <h4 className="font-semibold text-gray-700">평균 거래 금액:</h4>
                <p className="text-2xl font-bold text-green-500">+15%</p>
                <p className="text-sm text-gray-600">(신메뉴 출시 후)</p>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg mb-4">
              <p className="text-gray-700 italic">
                <span className="font-bold">NRR 변동 사유 (추정):</span> 안정적
                공급 만족도 증가, 신메뉴 출시로 거래 품목 확대.
              </p>
            </div>

            <h4 className="font-semibold text-gray-800 mb-2">
              CLV 관련 주요 지표 추이 및 시사점:
            </h4>
            <ul className="list-disc pl-5 space-y-2 text-gray-700 mb-4">
              <li>
                <span className="font-bold">거래 빈도:</span> 주 1회 주문으로
                <span className="font-bold">안정적으로 유지</span> 중.
              </li>
              <li>
                <span className="font-bold">평균 거래 금액 (AOV):</span> 신메뉴
                출시(2월) 이후 <span className="font-bold">12% 증가</span>.
              </li>
              <li>
                <span className="font-bold">거래 품목:</span> 기존 특란 중심에서
                <span className="font-bold">중란 거래 비중 크게 증가</span>.
              </li>
            </ul>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4">
              <h4 className="font-semibold text-gray-800 mb-3">
                📈 [B프랜차이즈 거래빈도/AOV/품목별 비중 추이 (최근 6개월)]
              </h4>
              <div className="chart-container">
                <canvas
                  id="customer2Chart"
                  style={{
                    display: "block",
                    boxSizing: "border-box",
                    height: "300px",
                    width: "600px",
                  }}
                  width="1200"
                  height="600"
                ></canvas>
              </div>
            </div>

            <div className="bg-egg-white p-4 rounded-lg">
              <p className="text-gray-700 italic">
                <span className="font-bold">시사점:</span> AOV 증가 및 거래 품목
                확대는 <span className="font-bold">긍정적인 CLV 흐름</span>을
                나타냅니다. 당사의 안정적 공급 능력 및 파트너십 강화 노력이
                긍정적 영향을 미친 것으로 보이며,
                <span className="font-bold">추가 성장 잠재력</span>이 높습니다.
              </p>
            </div>

            <div className="mt-4">
              <h4 className="font-semibold text-gray-800 mb-2">
                ▶️ 대응 방안:
              </h4>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>
                  <span className="font-bold">안정적 공급:</span> 물량 우선
                  배정으로 안정적 공급 유지
                </li>
                <li>
                  <span className="font-bold">분기 미팅:</span> 신메뉴 개발 계획
                  파악 및 맞춤형 제품 제안
                </li>
                <li>
                  <span className="font-bold">협력 강화:</span> 시장 정보 공유
                  등 파트너십 강화
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className="egg-yolk p-2 rounded-full mr-3">
              <i className="fas fa-exclamation-triangle text-white text-lg"></i>
            </div>
            <h2 className="text-xl font-bold text-gray-800">Disclaimer</h2>
          </div>

          <p className="text-sm text-gray-700">
            본 보고서는 현재까지 수집된 정보를 바탕으로 작성되었으며, 시장
            상황은 예기치 못한 변수에 의해 변동될 수 있습니다. NRR 및 CLV 분석은
            내부 데이터를 기반으로 한 추정치이며, 최종적인 의사결정은 본 보고서
            외 다양한 정보를 종합적으로 고려하여 주시기 바랍니다.
            <span className="font-bold">
              지역별 데이터의 기준일자가 상이한 점 참고 바랍니다.
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
