import React, { useState } from "react";
import PackageSearchForm from "./components/PackageSearchForm";
import PackageActionButtons from "./components/PackageActionButtons";
import PackageTable from "./components/PackageTable";
import PackageFormModal from "./components/PackageFormModal";
import AlertDialog from "@/components/ui/AlertDialog";
import { usePackageStore } from "../../store/packageStore";
// import Sidebar from '@/components/layout/Sidebar'; // 추후 생성 예정
// import PackageSearchForm from './PackageSearchForm'; // 추후 생성 예정
// import PackageActionButtons from './PackageActionButtons'; // 추후 생성 예정
// import PackageTable from './PackageTable'; // 추후 생성 예정
// import DashboardLayout from '@/components/layout/DashboardLayout'; // 추후 생성 예정

// Package 타입 정의 (PackageFormModal과 일치하게)
interface Package {
  id?: number;
  name: string;
  unit: string;
  cost: string;
  remarks: string;
  // 테이블 표시에 필요한 데이터 추가
  modifiedDate?: string;
  createdDate?: string;
}

const PackagePage: React.FC = () => {
  // zustand 패키지 상태 및 함수
  const packages = usePackageStore((state) => state.packages);
  const addPackage = usePackageStore((state) => state.addPackage);
  const updatePackage = usePackageStore((state) => state.updatePackage);
  const removePackage = usePackageStore((state) => state.removePackage);

  // 모달 상태 관리
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);

  // 다이얼로그 상태 관리
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertInfo, setAlertInfo] = useState<{
    title: string;
    description: string;
    onConfirm: () => void;
    cancelText?: string;
  }>({ title: "", description: "", onConfirm: () => {} });
  const [deletingPackageId, setDeletingPackageId] = useState<number | null>(
    null
  );

  // 테이블 선택 상태
  const [selectedPackageIds, setSelectedPackageIds] = useState<number[]>([]);

  // --- 핸들러 함수들 ---

  // 신규 버튼 클릭 핸들러
  const handleNewClick = () => {
    setEditingPackage(null);
    setIsFormModalOpen(true);
  };

  // 수정 버튼 클릭 핸들러 (테이블에서 호출 필요)
  const handleEditClick = (packageToEdit: Package) => {
    setEditingPackage(packageToEdit);
    setIsFormModalOpen(true);
  };

  // 삭제 버튼 클릭 핸들러
  const handleDeleteClick = () => {
    if (selectedPackageIds.length === 0) {
      alert("삭제할 항목을 선택해주세요.");
      return;
    }
    const packageToDelete = packages.find(
      (p) => p.id === selectedPackageIds[0]
    );
    if (!packageToDelete) return;

    setDeletingPackageId(packageToDelete.id ?? null);
    setAlertInfo({
      title: "삭제 확인",
      description: `포장 '${packageToDelete.name}-${packageToDelete.unit}'를(을) 정말 삭제하시겠습니까?`,
      onConfirm: handleDeleteConfirm,
      cancelText: "취소",
    });
    setIsAlertOpen(true);
  };

  // 폼 제출 핸들러 (신규/수정)
  const handleFormSubmit = (packageData: Package) => {
    if (editingPackage && editingPackage.id) {
      updatePackage({
        ...packageData,
        id: editingPackage.id,
        modifiedDate: new Date().toISOString().split("T")[0],
      });
      setAlertInfo({
        title: "수정 완료",
        description: `포장 '${packageData.name}-${packageData.unit}' 이(가) 수정되었습니다.`,
        onConfirm: () => setIsAlertOpen(false),
      });
    } else {
      const newId = Math.max(0, ...packages.map((p) => p.id ?? 0)) + 1;
      const today = new Date().toISOString().split("T")[0];
      addPackage({
        ...packageData,
        id: newId,
        createdDate: today,
        modifiedDate: today,
      });
      setAlertInfo({
        title: "등록 완료",
        description: `포장 '${packageData.name}-${packageData.unit}' 이(가) 등록되었습니다.`,
        onConfirm: () => setIsAlertOpen(false),
      });
    }
    setIsFormModalOpen(false);
    setIsAlertOpen(true);
  };

  // 삭제 확인 핸들러
  const handleDeleteConfirm = () => {
    if (deletingPackageId !== null) {
      const deletedPackage = packages.find((p) => p.id === deletingPackageId);
      removePackage(deletingPackageId);
      setDeletingPackageId(null);
      setSelectedPackageIds([]);
      setIsAlertOpen(false);
      if (deletedPackage) {
        setAlertInfo({
          title: "삭제 완료",
          description: `포장 '${deletedPackage.name}-${deletedPackage.unit}' 이(가) 삭제되었습니다.`,
          onConfirm: () => setIsAlertOpen(false),
        });
        setIsAlertOpen(true);
      }
    }
  };

  // 테이블 체크박스 변경 핸들러
  const handleCheckboxChange = (packageId: number, isChecked: boolean) => {
    setSelectedPackageIds((prev) =>
      isChecked ? [...prev, packageId] : prev.filter((id) => id !== packageId)
    );
  };
  // 테이블 헤더 체크박스 변경 핸들러
  const handleHeaderCheckboxChange = (isChecked: boolean) => {
    setSelectedPackageIds(isChecked ? packages.map((p) => p.id!) : []);
  };

  return (
    // <DashboardLayout> // 추후 생성 예정인 DashboardLayout으로 감쌀 예정
    <div className="flex">
      {/* <Sidebar /> */} {/* 추후 Sidebar 컴포넌트 추가 */}
      <main className="w-full bg-white rounded-[4px]">
        <h1 className="text-xl font-bold mb-4 px-4 pt-4">포장 관리</h1>

        <div className="bg-white p-4 border-t border-border">
          <PackageSearchForm /> {/* 검색 폼 컴포넌트 연결 */}
          {/* <PackageSearchForm /> */} {/* 추후 검색 폼 컴포넌트 추가 */}
          {/* <p>검색 폼 영역</p> */}
        </div>

        <div className="bg-white p-4 border-t border-border  flex justify-between items-center">
          <PackageActionButtons
            onNewClick={handleNewClick}
            onDeleteClick={handleDeleteClick}
            isEditDisabled={selectedPackageIds.length !== 1}
            isDeleteDisabled={selectedPackageIds.length === 0}
            onEditClick={() => {
              if (selectedPackageIds.length === 1) {
                const pkg = packages.find(
                  (p) => p.id === selectedPackageIds[0]
                );
                if (pkg) handleEditClick(pkg);
              }
            }}
          />{" "}
          {/* 액션 버튼 컴포넌트 연결 */}
          {/* <PackageActionButtons /> */} {/* 추후 액션 버튼 컴포넌트 추가 */}
          {/* <p>액션 버튼 영역</p> */}
        </div>

        <div className="bg-white p-4 border-t border-border">
          <PackageTable
            data={packages}
            selectedIds={selectedPackageIds}
            onCheckboxChange={handleCheckboxChange}
            onHeaderCheckboxChange={handleHeaderCheckboxChange}
          />{" "}
          {/* 테이블 컴포넌트 연결 */}
          {/* <PackageTable /> */} {/* 추후 테이블 컴포넌트 추가 */}
          {/* <p>테이블 영역</p> */}
        </div>

        <PackageFormModal
          isOpen={isFormModalOpen}
          onClose={() => setIsFormModalOpen(false)}
          onSubmit={handleFormSubmit}
          initialData={editingPackage}
        />
        <AlertDialog
          isOpen={isAlertOpen}
          onClose={() => setIsAlertOpen(false)}
          title={alertInfo.title}
          description={alertInfo.description}
          onConfirm={alertInfo.onConfirm}
          cancelText={alertInfo.cancelText}
        />
      </main>
    </div>
    // </DashboardLayout>
  );
};

export default PackagePage;
