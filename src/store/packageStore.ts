import { create } from "zustand";
import { Package } from "../types/package";

const initialPackages: Package[] = [
  {
    id: 1,
    name: "일반포장",
    unit: "150",
    cost: "10",
    remarks: "기본 포장",
    modifiedDate: "2024-06-01",
    createdDate: "2024-05-01",
  },
  {
    id: 2,
    name: "특수포장",
    unit: "150",
    cost: "30",
    remarks: "냉장",
    modifiedDate: "2024-06-02",
    createdDate: "2024-05-02",
  },
];

interface PackageStore {
  packages: Package[];
  setPackages: (packages: Package[]) => void;
  addPackage: (pkg: Package) => void;
  updatePackage: (pkg: Package) => void;
  removePackage: (id: number) => void;
}

export const usePackageStore = create<PackageStore>((set) => ({
  packages: initialPackages,
  setPackages: (packages) => set({ packages }),
  addPackage: (pkg) => set((state) => ({ packages: [...state.packages, pkg] })),
  updatePackage: (pkg) =>
    set((state) => ({
      packages: state.packages.map((p) => (p.id === pkg.id ? pkg : p)),
    })),
  removePackage: (id) =>
    set((state) => ({
      packages: state.packages.filter((p) => p.id !== id),
    })),
}));
