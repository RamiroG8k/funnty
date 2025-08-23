import { useCallback, useEffect, useRef, useState, PointerEvent } from "react";
import { cn } from "@/lib/utils";
import { ChevronUp, ChevronDown } from "lucide-react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    type CarouselApi,
} from "@/components/atoms/carousel";

export interface CarouselSelectorOption {
    label: string;
    key: string;
    value: number;
    unit?: string;
    step: number;
    min: number;
    max: number;
    format?: (value: number) => string;
}

interface CarouselSelectorProps {
    options: CarouselSelectorOption[];
    onValueChange: (key: string, value: number) => void;
    className?: string;
}

interface DragState {
    isDragging: boolean;
    startY: number;
    currentY: number;
    initialValue: number;
    pointerId: number | null;
}

export const CarouselSelector: React.FC<CarouselSelectorProps> = ({
    options,
    onValueChange,
    className,
}) => {
    const [api, setApi] = useState<CarouselApi>();
    const [selectedIndex, setSelectedIndex] = useState<number>(0);
    const dragRef = useRef<HTMLDivElement | null>(null);

    const [dragState, setDragState] = useState<DragState>({
        isDragging: false,
        startY: 0,
        currentY: 0,
        initialValue: 0,
        pointerId: null,
    });

    const [showLabel, setShowLabel] = useState(false);
    const labelTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const formatDisplay = useCallback((opt: CarouselSelectorOption) => {
        if (opt.format) return opt.format(opt.value);
        return `${Math.round(opt.value)}${opt.unit ?? ""}`;
    }, []);

    const triggerLabel = useCallback(() => {
        setShowLabel(true);
        if (labelTimeoutRef.current) clearTimeout(labelTimeoutRef.current);
        labelTimeoutRef.current = setTimeout(() => setShowLabel(false), 1400);
    }, []);

    const hapticFeedback = useCallback((intensity: number = 10) => {
        if ("vibrate" in navigator) {
            navigator.vibrate(intensity);
        }
    }, []);

    useEffect(() => {
        if (!api) return;

        const onSelect = () => {
            const current = api.selectedScrollSnap();
            setSelectedIndex(current);
            triggerLabel();
        };

        // Set initial selection
        onSelect();

        // Listen for selection changes
        api.on("select", onSelect);

        return () => {
            api.off("select", onSelect);
        };
    }, [api, triggerLabel]);

    // Handle drag start for value adjustment
    const handleDragStart = useCallback(
        (event: PointerEvent<HTMLDivElement>) => {
            // Only allow dragging on the center item
            const target = event.target as HTMLElement;
            const centerItem = target.closest("[data-center='true']");

            if (!centerItem) {
                return; // Not the center item, allow normal carousel behavior
            }

            event.preventDefault();
            event.stopPropagation();

            const startY = event.clientY;
            const activeOption = options[selectedIndex];

            setDragState({
                isDragging: true,
                startY,
                currentY: startY,
                initialValue: activeOption.value,
                pointerId: event.pointerId,
            });

            dragRef.current?.setPointerCapture(event.pointerId);
            hapticFeedback(5);
        },
        [options, selectedIndex, hapticFeedback],
    );

    // Handle drag move for value adjustment
    const handleDragMove = useCallback(
        (event: PointerEvent<HTMLDivElement>) => {
            if (!dragState.isDragging) return;

            event.preventDefault();

            const deltaY = event.clientY - dragState.startY;
            const activeOption = options[selectedIndex];

            if (!activeOption) return;

            // Calculate sensitivity based on step size and range
            const range = activeOption.max - activeOption.min;
            const baseSensitivity = range / 200; // Base sensitivity for 200px full range
            const sensitivity = Math.max(
                activeOption.step * 0.5,
                baseSensitivity,
            );

            const valueDelta = -deltaY * sensitivity; // Invert: up = increase
            let newValue = dragState.initialValue + valueDelta;

            // Apply constraints
            newValue = Math.max(
                activeOption.min,
                Math.min(activeOption.max, newValue),
            );

            // Round to step
            if (activeOption.step > 0) {
                newValue =
                    Math.round(newValue / activeOption.step) *
                    activeOption.step;
            }

            // Additional rounding based on value type patterns
            if (activeOption.key === "lineHeight") {
                newValue = Math.round(newValue * 100) / 100; // 2 decimal places
            } else if (
                activeOption.key === "letterSpacing" ||
                activeOption.key === "strokeWidth"
            ) {
                newValue = Math.round(newValue * 10) / 10; // 1 decimal place
            } else if (activeOption.key === "weight") {
                newValue = Math.round(newValue / 100) * 100; // Round to nearest 100
            } else {
                newValue = Math.round(newValue);
            }

            if (newValue !== activeOption.value) {
                onValueChange(activeOption.key, newValue);
                triggerLabel();
            }

            setDragState((prev) => ({
                ...prev,
                currentY: event.clientY,
            }));
        },
        [dragState, options, selectedIndex, onValueChange, triggerLabel],
    );

    // Handle drag end
    const handleDragEnd = useCallback(() => {
        if (dragState.isDragging) {
            hapticFeedback(10);
        }

        setDragState({
            isDragging: false,
            startY: 0,
            currentY: 0,
            initialValue: 0,
            pointerId: null,
        });

        if (dragState.pointerId !== null) {
            dragRef.current?.releasePointerCapture(dragState.pointerId);
        }
    }, [dragState.isDragging, dragState.pointerId, hapticFeedback]);

    // Handle item click (for non-center items)
    const handleItemClick = useCallback(
        (index: number) => {
            if (dragState.isDragging) return; // Don't scroll while dragging
            if (index === selectedIndex) return; // Already selected

            api?.scrollTo(index);
        },
        [api, selectedIndex, dragState.isDragging],
    );

    // Cleanup label timeout on unmount
    useEffect(() => {
        return () => {
            if (labelTimeoutRef.current) clearTimeout(labelTimeoutRef.current);
        };
    }, []);

    return (
        <div
            className={cn(
                "w-full rounded-md flex justify-center relative border bg-background shadow-xs dark:bg-input/30 dark:border-input",
                className,
            )}
        >
            <p
                className={cn(
                    "absolute -top-12 left-1/2 -translate-x-1/2 rounded-full px-4 py-2 text-sm font-medium text-center transition-all duration-300 pointer-events-none bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg z-10 text-nowrap",
                    showLabel
                        ? "opacity-100 translate-y-0 scale-100"
                        : "opacity-0 -translate-y-2 scale-95",
                )}
            >
                {options[selectedIndex]?.label}:{" "}
                {formatDisplay(options[selectedIndex])}
            </p>

            <Carousel
                setApi={setApi}
                opts={{
                    align: "center",
                    loop: true,
                    skipSnaps: true,
                    dragFree: false,
                }}
                className="w-full"
            >
                <CarouselContent
                    className={cn(
                        "my-0.5",
                        dragState.isDragging && "pointer-events-none",
                    )}
                >
                    {options.map((option, index) => {
                        const isActiveItem = index === selectedIndex;

                        return (
                            <CarouselItem
                                key={`${option.key}-${index}`}
                                className="basis-1/3"
                            >
                                <div
                                    ref={isActiveItem ? dragRef : undefined}
                                    data-center={isActiveItem}
                                    role="button"
                                    aria-label={`${option.label} ${formatDisplay(option)}`}
                                    onClick={() => handleItemClick(index)}
                                    onPointerDown={handleDragStart}
                                    onPointerMove={handleDragMove}
                                    onPointerUp={handleDragEnd}
                                    onPointerCancel={handleDragEnd}
                                    className={cn(
                                        "flex items-center justify-center py-1 rounded-sm transition-all duration-300 ease-in-out select-none touch-none relative",
                                        isActiveItem
                                            ? "cursor-ns-resize font-bold text-black opacity-100"
                                            : "cursor-pointer font-normal text-gray-400 opacity-60 hover:opacity-80",
                                        dragState.isDragging &&
                                            isActiveItem &&
                                            "bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg outline outline-blue-200",
                                    )}
                                >
                                    {isActiveItem && (
                                        <div className="absolute right-0.5 flex flex-col gap-0.5">
                                            <ChevronUp
                                                className={cn(
                                                    "h-3 w-3 transition-all duration-200",
                                                    dragState.isDragging
                                                        ? "opacity-100 text-blue-500"
                                                        : "opacity-40 text-gray-400",
                                                )}
                                            />
                                            <ChevronDown
                                                className={cn(
                                                    "h-3 w-3 transition-all duration-200",
                                                    dragState.isDragging
                                                        ? "opacity-100 text-blue-500"
                                                        : "opacity-40 text-gray-400",
                                                )}
                                            />
                                        </div>
                                    )}

                                    <div
                                        className={cn(
                                            "text-sm font-semibold transition-transform duration-200",
                                            isActiveItem
                                                ? "-translate-x-1"
                                                : "translate-x-0",
                                        )}
                                    >
                                        {formatDisplay(option)}
                                    </div>
                                </div>
                            </CarouselItem>
                        );
                    })}
                </CarouselContent>
            </Carousel>
        </div>
    );
};
