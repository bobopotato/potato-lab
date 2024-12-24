import { create } from "zustand";

interface DialogState {
  isOpen: boolean;
  title: string | null;
  description: string | null;
  onClose: () => void;
  onAction: () => void;
  openDialog: (data: {
    title: string;
    description: string;
    onCancel: () => void;
    onAction: () => void;
  }) => void;
}

const useDialogStore = create<DialogState>((set) => ({
  isOpen: false,
  title: null,
  description: null,
  onClose: () => {
    set({
      isOpen: false
    });
  },
  onAction: () => {
    //
  },
  openDialog: (data) => set((state) => ({ isOpen: true, ...data }))
}));

export default useDialogStore;
