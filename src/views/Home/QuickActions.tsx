import { Button } from "@/components/atoms/button";

import { useTextConfig } from "@/context/textConfig";

import { CarouselSelector, CarouselSelectorOption } from "./carousel-selector";
import { ChevronsUpDown } from "lucide-react";
import ColorSelector from "./color-selector";

export const QuickActions: React.FC = () => {
    const { updateConfig, ...config } = useTextConfig();

    const handleValueChange = (key: string, value: number) => {
        updateConfig({ [key]: value });
    };

    const options: CarouselSelectorOption[] = [
        {
            label: "Line Height",
            key: "lineHeight",
            value: config.lineHeight,
            unit: "",
            step: 0.1,
            min: -0.5,
            max: 5,
            format: (val) => val.toFixed(2),
        },
        {
            label: "Weight",
            key: "weight",
            value: Number(config.weight),
            unit: "w",
            step: 100,
            min: 100,
            max: 900,
        },
        {
            label: "Size",
            key: "size",
            value: config.size,
            unit: "px",
            step: 1,
            min: 8,
            max: 200,
        },
        // {
        //     label: "Spacing",
        //     key: "letterSpacing",
        //     value: config.letterSpacing,
        //     unit: "px",
        //     step: 0.1,
        //     min: -10,
        //     max: 20,
        //     format: (val) => val.toFixed(1),
        // },
        {
            label: "Stroke",
            key: "strokeWidth",
            value: config.strokeWidth,
            unit: "px",
            step: 0.25,
            min: 0,
            max: 20,
            format: (val) => val.toFixed(1),
        },
    ];

    return (
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
            <ColorSelector />
            {/*<Button
                size="sm"
                className="aspect-square shrink-0"
                variant="outline"
                onClick={() => {}}
            >
                <span
                    className="aspect-square size-3 rounded-full outline-2 outline-offset-2"
                    style={{
                        backgroundColor: config.color,
                        outlineColor: config.strokeColor,
                    }}
                />
            </Button>*/}

            <CarouselSelector
                className="w-3/4 max-w-52 lg:max-w-sm px-2"
                options={options}
                onValueChange={handleValueChange}
            />

            <Button
                size="sm"
                className="aspect-square shrink-0"
                variant="outline"
                onClick={() => {}}
            >
                <ChevronsUpDown />
            </Button>
        </div>
    );
};
