"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogFooter
} from "@potato-lab/ui";
import useDialogStore from "../../stores/useDialogStore";

const GlobalDialog = () => {
  const { isOpen, title, description, onClose, onAction } = useDialogStore();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <h2>{title}</h2>
        </DialogHeader>
        <DialogDescription>
          <p>{description}</p>
        </DialogDescription>
        <DialogFooter>
          <button onClick={onClose}>Cancel</button>
          <button onClick={onAction}>Confirm</button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GlobalDialog;
