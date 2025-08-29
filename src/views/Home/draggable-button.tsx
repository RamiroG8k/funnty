import { Button } from "@/components/atoms/button";
import { ChevronsUpDown } from "lucide-react";
import { useCallback, useRef, useState, PointerEvent } from "react";

interface DraggableButtonOption {
    key: string;
    value: number;
    step: number;
    min: number;
    max: number;
}

interface DraggableButtonProps {
    currentKey: string;
    options: DraggableButtonOption[];
    onValueChange: (key: string, value: number) => void;
    className?: string;
}

export const DraggableButton: React.FC<DraggableButtonProps> = ({
    currentKey,
    options,
    onValueChange,
    className,
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const dragStartY = useRef(0);
    const initialValue = useRef(0);

    const currentOption = options.find((option) => option.key === currentKey);

    const handlePointerDown = useCallback(
        (e: PointerEvent<HTMLButtonElement>) => {
            if (!currentOption) return;

            e.preventDefault();
            setIsDragging(true);
            dragStartY.current = e.clientY;
            initialValue.current = currentOption.value;
            (e.target as HTMLElement).setPointerCapture(e.pointerId);
        },
        [currentOption],
    );

    const handlePointerMove = useCallback(
        (e: PointerEvent<HTMLButtonElement>) => {
            if (!isDragging || !currentOption) return;

            const deltaY = e.clientY - dragStartY.current;
            const range = currentOption.max - currentOption.min;
            const sensitivity = Math.max(currentOption.step * 0.5, range / 200);
            const valueDelta = -deltaY * sensitivity;

            let newValue = initialValue.current + valueDelta;
            newValue = Math.max(
                currentOption.min,
                Math.min(currentOption.max, newValue),
            );

            if (currentOption.step > 0) {
                newValue =
                    Math.round(newValue / currentOption.step) *
                    currentOption.step;
            }

            // Apply specific rounding based on key type
            if (currentKey === "lineHeight") {
                newValue = Math.round(newValue * 100) / 100;
            } else if (
                currentKey === "letterSpacing" ||
                currentKey === "strokeWidth"
            ) {
                newValue = Math.round(newValue * 10) / 10;
            } else if (currentKey === "weight") {
                newValue = Math.round(newValue / 100) * 100;
            } else {
                newValue = Math.round(newValue);
            }

            if (newValue !== currentOption.value) {
                onValueChange(currentKey, newValue);
            }
        },
        [isDragging, currentOption, currentKey, onValueChange],
    );

    const handlePointerUp = useCallback(
        (e: PointerEvent<HTMLButtonElement>) => {
            setIsDragging(false);
            (e.target as HTMLElement).releasePointerCapture(e.pointerId);
        },
        [],
    );

    const handlePointerCancel = useCallback(
        (e: PointerEvent<HTMLButtonElement>) => {
            setIsDragging(false);
            (e.target as HTMLElement).releasePointerCapture(e.pointerId);
        },
        [],
    );

    return (
        <Button
            size="sm"
            className={`aspect-square shrink-0 cursor-ns-resize touch-none select-none ${className || ""}`}
            variant="outline"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
        >
            <ChevronsUpDown className={isDragging ? "text-blue-500" : ""} />
        </Button>
    );
};
