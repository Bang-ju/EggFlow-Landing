import React, { useState, useMemo } from "react";
// import AppLayout from '@/components/layout/AppLayout'; // 더 이상 사용하지 않음
import ItemSearchFilter from "@/pages/items/components/ItemSearchFilter";
import ItemActionButtons from "@/pages/items/components/ItemActionButtons";
import ItemTable from "@/pages/items/components/ItemTable";
import ItemDialog from "@/pages/items/components/ItemDialog";
import { OfficialPriceDialog } from "@/components/ui/OfficialPriceDialog";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { useItemStore } from "../../store/itemStore";
import { Item } from "../../types/item";

const ItemListPage: React.FC = () => {
  const items = useItemStore((state) => state.items);
  const addItem = useItemStore((state) => state.addItem);
  const updateItem = useItemStore((state) => state.updateItem);
  const removeItem = useItemStore((state) => state.removeItem);

  const [isItemDialogOpen, setIsItemDialogOpen] = useState(false);
  const [isOfficialPriceDialogOpen, setIsOfficialPriceDialogOpen] =
    useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [deletingItem, setDeletingItem] = useState<Item | null>(null);
  const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(
    new Set()
  );
  const [filterCriteria, setFilterCriteria] = useState({
    query: "",
    spec: "",
    packaging: "",
  });

  const handleCloseDialogs = () => {
    setIsItemDialogOpen(false);
    setIsOfficialPriceDialogOpen(false);
    setIsConfirmDialogOpen(false);
    setEditingItem(null);
    setDeletingItem(null);
  };

  const handleNew = () => {
    setEditingItem(null);
    setIsItemDialogOpen(true);
  };

  const handleEdit = () => {
    if (selectedItemIds.size !== 1) {
      alert("수정할 품목 1개를 선택해주세요.");
      return;
    }
    const selectedId = Array.from(selectedItemIds)[0];
    const itemToEdit = items.find((item) => item.id === selectedId);
    if (itemToEdit) {
      setEditingItem(itemToEdit);
      setIsItemDialogOpen(true);
    }
  };

  const handleDelete = () => {
    if (selectedItemIds.size === 0) {
      alert("삭제할 품목을 1개 이상 선택해주세요.");
      return;
    }
    const selectedId = Array.from(selectedItemIds)[0];
    const itemToDelete = items.find((item) => item.id === selectedId);
    if (itemToDelete) {
      setDeletingItem(itemToDelete);
      setIsConfirmDialogOpen(true);
    }
  };

  const handleOpenOfficialPriceDialog = () => {
    setIsOfficialPriceDialogOpen(true);
  };

  const handleSaveItem = (
    itemData: Omit<
      Item,
      "id" | "modifiedDate" | "createdDate" | "priceDiff"
    > & { id?: string }
  ) => {
    if (itemData.id) {
      updateItem({
        ...itemData,
        id: itemData.id,
        modifiedDate: new Date().toISOString().split("T")[0],
      } as Item);
    } else {
      const newItem: Item = {
        ...itemData,
        id: String(Date.now()),
        modifiedDate: new Date().toISOString().split("T")[0],
        createdDate: new Date().toISOString().split("T")[0],
        priceDiff: 0,
      } as Item;
      addItem(newItem);
    }
    handleCloseDialogs();
  };

  const handleConfirmDelete = () => {
    if (!deletingItem) return;
    removeItem(deletingItem.id);
    setSelectedItemIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(deletingItem.id);
      return newSet;
    });
    handleCloseDialogs();
  };

  const handleSelectionChange = (itemId: string, isSelected: boolean) => {
    setSelectedItemIds((prev) => {
      const newSet = new Set(prev);
      if (isSelected) {
        newSet.add(itemId);
      } else {
        newSet.delete(itemId);
      }
      return newSet;
    });
  };

  const handleSearch = (criteria: {
    query: string;
    spec: string;
    packaging: string;
  }) => {
    setFilterCriteria(criteria);
  };

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const queryMatch = filterCriteria.query
        ? item.code.includes(filterCriteria.query) ||
          item.name.toLowerCase().includes(filterCriteria.query.toLowerCase())
        : true;
      const specMatch = filterCriteria.spec
        ? item.spec === filterCriteria.spec
        : true;
      const packagingMatch = filterCriteria.packaging
        ? item.packaging === filterCriteria.packaging
        : true;
      return queryMatch && specMatch && packagingMatch;
    });
  }, [items, filterCriteria]);

  const handleSelectAll = (isAllSelected: boolean) => {
    if (isAllSelected) {
      setSelectedItemIds(new Set(filteredItems.map((item) => item.id)));
    } else {
      setSelectedItemIds(new Set());
    }
  };

  return (
    <div className="flex flex-col bg-white">
      <h1 className="text-xl font-bold p-4 ">품목 목록</h1>
      <ItemSearchFilter
        onOpenOfficialPrice={handleOpenOfficialPriceDialog}
        onSearch={handleSearch}
      />
      <ItemActionButtons
        onNew={handleNew}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <ItemTable
        items={filteredItems}
        selectedItemIds={selectedItemIds}
        onSelectionChange={handleSelectionChange}
        onSelectAll={handleSelectAll}
      />

      <ItemDialog
        isOpen={isItemDialogOpen}
        onClose={handleCloseDialogs}
        itemData={editingItem}
        onSave={handleSaveItem}
      />
      <OfficialPriceDialog
        isOpen={isOfficialPriceDialogOpen}
        onClose={handleCloseDialogs}
      />
      {deletingItem && (
        <ConfirmDialog
          isOpen={isConfirmDialogOpen}
          onClose={handleCloseDialogs}
          onConfirm={handleConfirmDelete}
          title="삭제 확인"
          message={`품목 '${deletingItem.name}'을(를) 삭제하시겠습니까?`}
          confirmText="삭제"
          confirmVariant="destructive"
        />
      )}
    </div>
  );
};

export default ItemListPage;
