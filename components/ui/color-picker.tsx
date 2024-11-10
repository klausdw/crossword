"use client";

import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
}

const ColorPicker = forwardRef<
  HTMLInputElement,
  Omit<ButtonProps, "value" | "onChange" | "onBlur"> & ColorPickerProps
>(
  (
    { disabled, value, onChange, onBlur, name, className, ...props },
    forwardedRef
  ) => {
    const ref = useForwardedRef(forwardedRef);
    const [open, setOpen] = useState(false);

    const parsedValue = useMemo(() => {
      return value || "#edf2f7";
    }, [value]);

    return (
      <Popover onOpenChange={setOpen} open={open}>
        <PopoverTrigger asChild disabled={disabled} onBlur={onBlur}>
          <Button
            {...props}
            name={name}
            onClick={() => {
              setOpen(true);
            }}
            size="icon"
            variant="outline"
            className="w-1/4 bg-lime-600 text-white hover:text-white hover:bg-lime-900"
          >
            <div
              className="w-4 h-4 rounded-md border-2 border-white"
              style={{ backgroundColor: parsedValue }}
            />
            Kästchen hintergrund ändern
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full">
          <Input
            type="color"
            className="p-1 h-20 w-2/3 mx-auto block bg-white border border-gray-200 cursor-pointer rounded-lg disabled:opacity-50 disabled:pointer-events-none"
            value={parsedValue}
            onChange={(e) => {
              onChange(e?.currentTarget?.value);
            }}
            ref={ref}
            maxLength={7}
          />
          <Input
            maxLength={7}
            onChange={(e) => {
              onChange(e?.currentTarget?.value);
            }}
            ref={ref}
            value={parsedValue}
          />
        </PopoverContent>
      </Popover>
    );
  }
);

ColorPicker.displayName = "ColorPicker";
export { ColorPicker };

function useForwardedRef<T>(ref: React.ForwardedRef<T>) {
  const innerRef = useRef<T>(null);

  useEffect(() => {
    if (!ref) return;
    if (typeof ref === "function") {
      ref(innerRef.current);
    } else {
      ref.current = innerRef.current;
    }
  });

  return innerRef;
}
