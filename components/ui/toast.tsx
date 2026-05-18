"use client";

import * as React from "react";
import * as ToastPrimitives from "@radix-ui/react-toast";

type ToastItem = {
  id: string;
  title: string;
  description?: string;
};

type ToastContextValue = {
  push: (item: Omit<ToastItem, "id">) => void;
};

const ToastContext = React.createContext<ToastContextValue | null>(null);

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  const push = React.useCallback((item: Omit<ToastItem, "id">) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { ...item, id }]);
  }, []);

  return (
    <ToastContext.Provider value={{ push }}>
      <ToastPrimitives.Provider swipeDirection="right">
        {children}
        {toasts.map((toast) => (
          <ToastPrimitives.Root
            key={toast.id}
            open
            onOpenChange={(open) => {
              if (!open) setToasts((prev) => prev.filter((item) => item.id !== toast.id));
            }}
            duration={2600}
            className="mb-3 w-[320px] rounded-lg border border-primary/15 bg-white p-4 text-primary shadow-lg"
          >
            <ToastPrimitives.Title className="text-sm font-semibold">
              {toast.title}
            </ToastPrimitives.Title>
            {toast.description ? (
              <ToastPrimitives.Description className="mt-1 text-xs text-primary/70">
                {toast.description}
              </ToastPrimitives.Description>
            ) : null}
          </ToastPrimitives.Root>
        ))}
        <ToastPrimitives.Viewport className="fixed bottom-4 right-4 z-[100] flex w-[340px] max-w-[90vw] flex-col outline-none" />
      </ToastPrimitives.Provider>
    </ToastContext.Provider>
  );
}
