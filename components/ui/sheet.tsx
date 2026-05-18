"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ReactNode } from "react";

export const Sheet = DialogPrimitive.Root;
export const SheetTrigger = DialogPrimitive.Trigger;
export const SheetClose = DialogPrimitive.Close;

export function SheetContent({ children }: { children: ReactNode }) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-[60] bg-black/35" />
      <DialogPrimitive.Content className="fixed inset-y-0 left-0 z-[61] w-[260px] bg-white shadow-2xl">
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}
