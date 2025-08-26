import React from "react";
import { Button } from "../atoms/button";

import { Share2, Link, Clipboard, Download, Palette } from "lucide-react";
import { useTextConfig } from "@/context/textConfig";
import { Popover, PopoverContent, PopoverTrigger } from "../atoms/popover";
import {
    shareUrl,
    downloadCanvasAsImage,
    copyCanvasAsImage,
} from "./TextCanvas/canvasTextUtils";

import {
    CarouselSelector,
    CarouselSelectorOption,
} from "../molecules/carousel-selector";

interface QuickActionsProps {
    canvas?: HTMLCanvasElement | null;
}

export const QuickActions: React.FC<QuickActionsProps> = (props) => {
    const { canvas } = props;
    const { updateConfig, ...config } = useTextConfig();

    const handleShareUrl = () => {
        shareUrl(config);
    };

    const handleDownload = () => {
        if (canvas) {
            downloadCanvasAsImage(canvas);
        }
    };

    const handleCopyImage = async () => {
        if (canvas) {
            await copyCanvasAsImage(canvas);
        }
    };

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
            <Button
                size="sm"
                className="aspect-square shrink-0"
                variant="outline"
            >
                <Palette />
            </Button>

            <CarouselSelector
                className="w-3/4 max-w-52 lg:max-w-sm px-2"
                options={options}
                onValueChange={handleValueChange}
            />

            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0 bg-background hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
                    >
                        <Share2 className="h-3.5 w-3.5" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-40 p-1.5" align="end">
                    <div className="flex flex-col gap-0.5">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleShareUrl}
                            className="justify-start gap-2"
                        >
                            <Link className="h-3.5 w-3.5" />
                            Share URL
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleCopyImage}
                            className="justify-start gap-2"
                        >
                            <Clipboard className="h-3.5 w-3.5" />
                            Copy Image
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleDownload}
                            className="justify-start gap-2"
                        >
                            <Download className="h-3.5 w-3.5" />
                            Download
                        </Button>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
};
