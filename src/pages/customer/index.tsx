import React from "react";
import CustomerFilters from "./components/CustomerFilters";
import CustomerTable from "./components/CustomerTable";
import AddCustomerModal from "./components/AddCustomerModal";
import EditCustomerModal from "./components/EditCustomerModal";

import {
  BlueButton,
  GreenButton,
  RedButton,
  GrayButton,
} from "../../components/ui/button";
import { Customer } from "@/types/customer";

const CustomerPage = () => {
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [selectedCustomer, setSelectedCustomer] =
    React.useState<Customer | null>(null);
  const [selectedRows, setSelectedRows] = React.useState<number[]>([]);

  // Function to handle opening the edit modal
  const handleEditClick = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsEditModalOpen(true);
  };

  // TODO: Implement delete logic
  const handleDeleteClick = () => {
    // Get selected IDs from CustomerTable state (needs implementation)
    console.log(
      "Delete logic needs implementation based on selected rows in table."
    );
    // Show confirmation dialog
  };

  // 선택된 고객 1명일 때만 수정
  const handleEditButtonClick = () => {
    if (selectedRows.length === 1) {
      // CustomerTable에서 해당 고객 정보 찾아서 setSelectedCustomer
      // (실제 데이터는 CustomerTable에서 받아오거나, props로 내려받아야 함)
      // 여기서는 dummyCustomers를 CustomerTable에서 import할 수 없으니, CustomerTable에서 선택된 고객 정보를 prop으로 올려주는 구조가 필요함
      // 임시로 selectedCustomer를 null로 두고, 실제 구현 시 데이터 연동 필요
      setSelectedCustomer({
        id: selectedRows[0],
        name: "",
        manager: "",
        type: "",
        ceoName: "",
        businessNumber: "",
        phone: "",
        address: "",
        region: "",
        discount: 0,
        registrationDate: "",
        balance: 0,
        profit: 0,
        totalTransaction: 0,
      });
      setIsEditModalOpen(true);
    } else if (selectedRows.length > 1) {
      alert("수정은 한 명만 선택할 때만 가능합니다.");
    } else {
      alert("수정할 거래처를 테이블에서 선택해주세요.");
    }
  };

  return (
    <div className="bg-white flex flex-col">
      <h1 className="text-xl font-bold p-4">거래처 목록</h1>
      <CustomerFilters />
      <div className="flex justify-between items-center p-4 border-t border-border">
        <div className="flex gap-4">
          <GreenButton onClick={() => setIsAddModalOpen(true)}>
            신규
          </GreenButton>
          <BlueButton onClick={handleEditButtonClick}>수정</BlueButton>
          <RedButton onClick={handleDeleteClick}>삭제</RedButton>
        </div>
        <div className="flex gap-2">
          <GrayButton
            onClick={() => {
              /* TODO: Add excel download logic */
            }}
          >
            액셀 다운로드
          </GrayButton>
          <GrayButton
            onClick={() => {
              /* TODO: Add print logic */
            }}
          >
            인쇄
          </GrayButton>
        </div>
      </div>
      <CustomerTable
        onEditClick={handleEditClick}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
      />

      <AddCustomerModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
      <EditCustomerModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedCustomer(null);
        }}
        customerData={selectedCustomer}
      />
    </div>
  );
};

export default CustomerPage;
