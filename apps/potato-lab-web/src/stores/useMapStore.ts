import { create } from "zustand";

interface MapStore {
  selectedMarker: string | undefined;
  setSelectedMarker: (id: string | undefined) => void;
}

const useMapStore = create<MapStore>((set) => ({
  selectedMarker: undefined,
  setSelectedMarker: (id) => set({ selectedMarker: id })
}));

export default useMapStore;
