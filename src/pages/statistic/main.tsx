import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import annotationPlugin from "chartjs-plugin-annotation";

Chart.register(annotationPlugin);

export const StatisticPage = () => {
  // 공통 차트 옵션
  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          font: {
            family: "'Noto Sans KR', sans-serif",
          },
        },
      },
    },
  } as const;

  // 월별 레이블
  const monthLabels = [
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월",
  ];

  // 색상 팔레트
  const colors = {
    //   primary: "#4F46E5",
    //   secondary: "#6366F1",
    //   accent: "#818CF8",
    //   success: "#10B981",
    warning: "#F59E0B",
    //   danger: "#EF4444",
    gray: "#9CA3AF",

    primary: "#FFD166", // egg-yolk - 주요 강조색
    secondary: "#D4A373", // egg-brown - 보조 강조색
    accent: "#F7F7F7", // egg-white - 중성/배경색
    base: "#F8F5F0", // egg-shell - 기본 배경색

    // 상태 표시 색상
    success: "#2A9D8F", // 하락/긍정
    danger: "#E63946", // 상승/부정
    info: "#457B9D",
  };

  // 차트 ref 준비
  const inventoryTurnoverRef = useRef<HTMLCanvasElement>(null);
  const inventoryFlowRef = useRef<HTMLCanvasElement>(null);
  const nrrRef = useRef<HTMLCanvasElement>(null);
  const revenueRef = useRef<HTMLCanvasElement>(null);
  const clvRef = useRef<HTMLCanvasElement>(null);
  const clvComparisonRef = useRef<HTMLCanvasElement>(null);
  const clientTypeRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!inventoryTurnoverRef.current) return;
    const chart = new Chart(inventoryTurnoverRef.current, {
      type: "line",
      data: {
        labels: monthLabels,
        datasets: [
          {
            label: "재고회전율",
            data: [
              10.2, 11.5, 10.8, 11.2, 12.1, 11.8, 12.3, 12.5, 12.8, 12.5, 13.1,
              12.5,
            ],
            borderColor: colors.primary,
            backgroundColor: colors.primary,
            tension: 0.4,
          },
        ],
      },
      options: {
        ...commonOptions,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "회전율",
            },
          },
        },
      },
    });
    return () => chart.destroy();
  }, []);

  useEffect(() => {
    if (!inventoryFlowRef.current) return;
    const chart = new Chart(inventoryFlowRef.current, {
      type: "bar",
      data: {
        labels: Array.from({ length: 30 }, (_, i) => `${i + 1}일`),
        datasets: [
          {
            label: "입고량",
            data: Array.from({ length: 30 }, () =>
              Math.floor(Math.random() * 1000 + 2000)
            ),
            backgroundColor: colors.success,
          },
          {
            label: "출고량",
            data: Array.from({ length: 30 }, () =>
              Math.floor(Math.random() * 1000 + 1800)
            ),
            backgroundColor: colors.warning,
          },
        ],
      },
      options: {
        ...commonOptions,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "수량",
            },
          },
        },
      },
    });
    return () => chart.destroy();
  }, []);

  useEffect(() => {
    if (!nrrRef.current) return;
    const chart = new Chart(nrrRef.current, {
      type: "line",
      data: {
        labels: monthLabels,
        datasets: [
          {
            label: "NRR",
            data: [115, 118, 116, 120, 122, 119, 121, 120, 123, 122, 125, 120],
            borderColor: colors.success,
            backgroundColor: colors.success,
            tension: 0.4,
          },
        ],
      },
      options: {
        ...commonOptions,
        scales: {
          y: {
            min: 90,
            max: 130,
            title: {
              display: true,
              text: "%",
            },
          },
        },
        plugins: {
          ...commonOptions.plugins,
          annotation: {
            annotations: {
              line1: {
                type: "line",
                yMin: 100,
                yMax: 100,
                borderColor: colors.danger,
                borderWidth: 2,
                borderDash: [6, 6],
                label: {
                  content: "기준선 (100%)",
                  display: true,
                  position: "end",
                },
              },
            },
          },
        },
      },
    });
    return () => chart.destroy();
  }, []);

  useEffect(() => {
    if (!revenueRef.current) return;
    const chart = new Chart(revenueRef.current, {
      type: "line",
      data: {
        labels: monthLabels,
        datasets: [
          {
            label: "확장 수익",
            data: [280, 300, 290, 310, 320, 315, 330, 325, 340, 335, 350, 300],
            borderColor: colors.success,
            backgroundColor: colors.success,
            tension: 0.4,
          },
          {
            label: "축소 수익",
            data: [45, 50, 48, 52, 55, 53, 58, 56, 60, 58, 62, 50],
            borderColor: colors.warning,
            backgroundColor: colors.warning,
            tension: 0.4,
          },
          {
            label: "이탈 수익",
            data: [140, 150, 145, 155, 160, 158, 165, 162, 170, 168, 175, 150],
            borderColor: colors.danger,
            backgroundColor: colors.danger,
            tension: 0.4,
          },
        ],
      },
      options: {
        ...commonOptions,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "만원",
            },
          },
        },
      },
    });
    return () => chart.destroy();
  }, []);

  useEffect(() => {
    if (!clvRef.current) return;
    const chart = new Chart(clvRef.current, {
      type: "bar",
      data: {
        labels: [
          "100만원 미만",
          "100-300만원",
          "300-500만원",
          "500-700만원",
          "700만원 이상",
        ],
        datasets: [
          {
            label: "고객 수",
            data: [150, 280, 320, 180, 70],
            backgroundColor: colors.primary,
          },
        ],
      },
      options: {
        ...commonOptions,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "고객 수",
            },
          },
        },
      },
    });
    return () => chart.destroy();
  }, []);

  useEffect(() => {
    if (!clvComparisonRef.current) return;
    const chart = new Chart(clvComparisonRef.current, {
      type: "bar",
      data: {
        labels: ["1분기", "2분기", "3분기", "4분기"],
        datasets: [
          {
            label: "상위 20% CLV",
            data: [850, 880, 900, 920],
            backgroundColor: colors.success,
          },
          {
            label: "하위 20% CLV",
            data: [120, 115, 125, 130],
            backgroundColor: colors.warning,
          },
        ],
      },
      options: {
        ...commonOptions,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "만원",
            },
          },
        },
      },
    });
    return () => chart.destroy();
  }, []);

  useEffect(() => {
    if (!clientTypeRef.current) return;
    const chart = new Chart(clientTypeRef.current, {
      type: "bar",
      data: {
        labels: ["마트", "식당", "도매상"],
        datasets: [
          {
            label: "평균 CLV",
            data: [420, 380, 580],
            backgroundColor: [colors.primary, colors.secondary, colors.base],
          },
        ],
      },
      options: {
        ...commonOptions,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "만원",
            },
          },
        },
      },
    });
    return () => chart.destroy();
  }, []);

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-base">
      <div className="container mx-auto px-2 md:px-4 py-4 md:py-8">
        {/* <!-- 재무/운영 지표 섹션 --> */}
        <section className="mb-6 md:mb-10 fade-in">
          <div className="flex items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              재무/운영 지표
            </h2>
            <div className="tooltip-container ml-2">
              <div className="help-icon">?</div>
              <div className="tooltip-text">
                재무/운영 지표는 기업의 전반적인 재무 건전성과 운영 효율성을
                보여주는 핵심 지표들입니다. 매출액, 순이익, 재고회전율 등을
                포함합니다.
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {/* <!-- 매출액 카드 --> */}
            <div className="bg-white p-6 rounded-lg shadow-md card">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <div className="icon-wrapper">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-gray-800">
                      매출액
                    </h3>
                    <div className="tooltip-container ml-2">
                      <div className="help-icon small">?</div>
                      <div className="tooltip-text">
                        총 매출액은 기업의 모든 제품과 서비스 판매로 인한 수익의
                        합계입니다.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-3xl font-bold text-primary mb-2">
                ₩125.8M
              </div>
              <div className="flex items-center text-sm">
                <span className="text-success mr-1">↑ 12.5%</span>
                <span className="text-gray-500">전월 대비</span>
              </div>
            </div>

            {/* <!-- 순이익 카드 --> */}
            <div className="bg-white p-6 rounded-lg shadow-md card">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <div className="icon-wrapper">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                      ></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-gray-800">
                      순이익
                    </h3>
                    <div className="tooltip-container ml-2">
                      <div className="help-icon small">?</div>
                      <div className="tooltip-text">
                        순이익은 모든 비용과 세금을 제외한 실제 수익을
                        나타냅니다.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-3xl font-bold text-success mb-2">₩28.3M</div>
              <div className="flex items-center text-sm">
                <span className="text-success mr-1">↑ 8.2%</span>
                <span className="text-gray-500">전월 대비</span>
              </div>
            </div>

            {/* <!-- 재고회전율 카드 --> */}
            <div className="bg-white p-6 rounded-lg shadow-md card">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <div className="icon-wrapper">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      ></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-gray-800">
                      재고회전율
                    </h3>
                    <div className="tooltip-container ml-2">
                      <div className="help-icon small">?</div>
                      <div className="tooltip-text">
                        재고회전율은 재고가 판매되어 회전되는 속도를 나타내는
                        지표입니다.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-3xl font-bold text-secondary mb-2">
                12.5회
              </div>
              <div className="flex items-center text-sm">
                <span className="text-success mr-1">↑ 1.2회</span>
                <span className="text-gray-500">전월 대비</span>
              </div>
            </div>

            {/* <!-- 입출고 현황 카드 --> */}
            <div className="bg-white p-6 rounded-lg shadow-md card">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <div className="icon-wrapper">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                      ></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-gray-800">
                      입출고 현황
                    </h3>
                    <div className="tooltip-container ml-2">
                      <div className="help-icon small">?</div>
                      <div className="tooltip-text">
                        일일 입고량과 출고량을 비교하여 재고 흐름을 파악할 수
                        있습니다.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">입고</p>
                  <p className="text-xl font-bold text-success">2,450개</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">출고</p>
                  <p className="text-xl font-bold text-warning">2,180개</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* <!-- CLV 섹션 --> */}
        <section className="mb-6 md:mb-10 fade-in">
          <div className="flex items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              고객생애가치 분석
            </h2>
            <div className="tooltip-container ml-2">
              <div className="help-icon">?</div>
              <div className="tooltip-text">
                고객생애가치(CLV) 분석은 고객의 장기적 가치와 수익성을 평가하는
                지표들을 보여줍니다.
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            {/* <!-- CLV 히스토그램 --> */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <h3 className="text-xl font-medium text-gray-800">CLV 분포</h3>
                <div className="tooltip-container ml-2">
                  <div className="help-icon small">?</div>
                  <div className="tooltip-text">
                    CLV 분포 히스토그램은 다양한 고객생애가치 범위에 속하는 고객
                    수를 보여줍니다.
                  </div>
                </div>
              </div>
              <div className="h-64">
                <canvas
                  ref={clvRef}
                  style={{
                    display: "block",
                    boxSizing: "border-box",
                    height: "256px",
                    width: "437px",
                  }}
                  width="874"
                  height="512"
                />
              </div>
            </div>

            {/* <!-- 하위/상위 CLV 히스토그램 --> */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <h3 className="text-xl font-medium text-gray-800">
                  하위/상위 CLV 비교
                </h3>
                <div className="tooltip-container ml-2">
                  <div className="help-icon small">?</div>
                  <div className="tooltip-text">
                    상위 20%와 하위 20% 고객의 CLV 차이를 보여줍니다.
                  </div>
                </div>
              </div>
              <div className="h-64">
                <canvas
                  ref={clvComparisonRef}
                  style={{
                    display: "block",
                    boxSizing: "border-box",
                    height: "256px",
                    width: "437px",
                  }}
                  width="874"
                  height="512"
                />
              </div>
            </div>

            {/* <!-- 거래처 유형별 CLV --> */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <h3 className="text-xl font-medium text-gray-800">
                  거래처 유형별 CLV
                </h3>
                <div className="tooltip-container ml-2">
                  <div className="help-icon small">?</div>
                  <div className="tooltip-text">
                    마트, 식당, 도매상 등 거래처 유형별 평균 CLV를 비교합니다.
                  </div>
                </div>
              </div>
              <div className="h-64">
                <canvas
                  ref={clientTypeRef}
                  style={{
                    display: "block",
                    boxSizing: "border-box",
                    height: "256px",
                    width: "437px",
                  }}
                  width="874"
                  height="512"
                />
              </div>
            </div>
          </div>
        </section>

        {/* <!-- NRR 섹션 --> */}
        <section className="mb-6 md:mb-10 fade-in">
          <div className="flex items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              순수익 유지율 분석
            </h2>
            <div className="tooltip-container ml-2">
              <div className="help-icon">?</div>
              <div className="tooltip-text">
                순수익 유지율(NRR) 분석은 기존 고객으로부터의 수익 유지와 성장을
                평가합니다.
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {/* <!-- NRR 추이 그래프 --> */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <h3 className="text-xl font-medium text-gray-800">NRR 추이</h3>
                <div className="tooltip-container ml-2">
                  <div className="help-icon small">?</div>
                  <div className="tooltip-text">
                    시간 경과에 따른 순수 수익 유지율의 변화를 보여줍니다.
                  </div>
                </div>
              </div>
              <div className="h-64">
                <canvas
                  ref={nrrRef}
                  style={{
                    display: "block",
                    boxSizing: "border-box",
                    height: "256px",
                    width: "692px",
                  }}
                  width="1384"
                  height="512"
                />
              </div>
            </div>

            {/* <!-- 수익 구성 추이 --> */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <h3 className="text-xl font-medium text-gray-800">
                  수익 구성 추이
                </h3>
                <div className="tooltip-container ml-2">
                  <div className="help-icon small">?</div>
                  <div className="tooltip-text">
                    확장, 축소, 이탈 수익의 변화를 시간에 따라 보여줍니다.
                  </div>
                </div>
              </div>
              <div className="h-64">
                <canvas
                  ref={revenueRef}
                  style={{
                    display: "block",
                    boxSizing: "border-box",
                    height: "256px",
                    width: "692px",
                  }}
                  width="1384"
                  height="512"
                />
              </div>
            </div>
          </div>
        </section>

        {/* <!-- 재고/운영 분석 섹션 --> */}
        <section className="fade-in">
          <div className="flex items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              재고/운영 분석
            </h2>
            <div className="tooltip-container ml-2">
              <div className="help-icon">?</div>
              <div className="tooltip-text">
                재고 관리와 운영 효율성을 분석하는 주요 지표들을 보여줍니다.
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {/* <!-- 재고회전율 추이 --> */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <h3 className="text-xl font-medium text-gray-800">
                  재고회전율 추이
                </h3>
                <div className="tooltip-container ml-2">
                  <div className="help-icon small">?</div>
                  <div className="tooltip-text">
                    월별 재고회전율의 변화를 보여줍니다.
                  </div>
                </div>
              </div>
              <div className="h-64">
                <canvas
                  ref={inventoryTurnoverRef}
                  style={{
                    display: "block",
                    boxSizing: "border-box",
                    height: "256px",
                    width: "692px",
                  }}
                  width="1384"
                  height="512"
                />
              </div>
            </div>

            {/* <!-- 일일 입출고 현황 --> */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <h3 className="text-xl font-medium text-gray-800">
                  일일 입출고 현황
                </h3>
                <div className="tooltip-container ml-2">
                  <div className="help-icon small">?</div>
                  <div className="tooltip-text">
                    최근 30일간의 일일 입고량과 출고량을 비교합니다.
                  </div>
                </div>
              </div>
              <div className="h-64">
                <canvas
                  ref={inventoryFlowRef}
                  style={{
                    display: "block",
                    boxSizing: "border-box",
                    height: "256px",
                    width: "692px",
                  }}
                  width="1384"
                  height="512"
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};
