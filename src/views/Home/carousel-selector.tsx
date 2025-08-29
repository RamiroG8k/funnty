import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
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
    onActiveKeyChange?: (key: string) => void;
    className?: string;
}

export const CarouselSelector: React.FC<CarouselSelectorProps> = ({
    options,
    onActiveKeyChange,
    className,
}) => {
    const [api, setApi] = useState<CarouselApi>();
    const [selectedIndex, setSelectedIndex] = useState<number>(0);

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

    useEffect(() => {
        if (!api) return;

        const onSelect = () => {
            const current = api.selectedScrollSnap();
            setSelectedIndex(current);
            const currentOption = options[current];
            if (currentOption) {
                onActiveKeyChange?.(currentOption.key);
            }
            triggerLabel();
        };

        // Set initial selection
        onSelect();

        // Listen for selection changes
        api.on("select", onSelect);

        return () => {
            api.off("select", onSelect);
        };
    }, [api, triggerLabel, onActiveKeyChange, options]);

    // Handle item click (for non-center items)
    const handleItemClick = useCallback(
        (index: number) => {
            if (index === selectedIndex) return; // Already selected

            api?.scrollTo(index);
        },
        [api, selectedIndex],
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
                <CarouselContent className="my-0.5">
                    {options.map((option, index) => {
                        const isActiveItem = index === selectedIndex;

                        return (
                            <CarouselItem
                                key={`${option.key}-${index}`}
                                className="basis-1/3"
                            >
                                <div
                                    role="button"
                                    aria-label={`${option.label} ${formatDisplay(option)}`}
                                    onClick={() => handleItemClick(index)}
                                    className={cn(
                                        "flex items-center justify-center py-1 rounded-sm transition-all duration-300 ease-in-out select-none relative",
                                        isActiveItem
                                            ? "font-bold text-black opacity-100"
                                            : "cursor-pointer font-normal text-gray-400 opacity-60 hover:opacity-80",
                                    )}
                                >
                                    <div className="text-sm font-semibold transition-transform duration-200">
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
