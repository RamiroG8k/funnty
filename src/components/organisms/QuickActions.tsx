import React from "react";
import { Button } from "../atoms/button";
import { Slider } from "../atoms/slider";
import { Share2, Link, Clipboard, Download, Settings } from "lucide-react";
import { TextConfig, useTextConfig } from "@/context/textConfig";
import { Popover, PopoverContent, PopoverTrigger } from "../atoms/popover";
import {
    shareUrl,
    downloadCanvasAsImage,
    copyCanvasAsImage,
} from "./TextCanvas/canvasTextUtils";
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "../molecules/drawer";
import { ControlPanel } from "./ControlPanel";

interface QuickActionsProps {
    canvas?: HTMLCanvasElement | null;
}

export const QuickActions: React.FC<QuickActionsProps> = (props) => {
    const { canvas } = props;
    const textConfig = useTextConfig();
    const { updateConfig, weight } = textConfig;

    const handleWeightChange = ([value]: number[]) => {
        const newWeight = value.toString() as TextConfig["weight"];
        updateConfig({ weight: newWeight });

        if ("vibrate" in navigator) {
            navigator.vibrate(10);
        }
    };

    const getWeightLabel = (weight: string) => {
        const weightMap: Record<string, string> = {
            "100": "Thin",
            "200": "ExtraLight",
            "300": "Light",
            "400": "Regular",
            "500": "Medium",
            "600": "SemiBold",
            "700": "Bold",
            "800": "ExtraBold",
            "900": "Black",
        };
        return weightMap[weight] || weight;
    };

    const handleShareUrl = () => {
        shareUrl(textConfig);
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

    return (
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 md:gap-3">
            <Drawer>
                <DrawerTrigger asChild>
                    <Button
                        variant="outline"
                        size="sm"
                        className="bg-background hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
                    >
                        <Settings className="h-4 w-4" />
                    </Button>
                </DrawerTrigger>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>Text Settings</DrawerTitle>
                        <DrawerDescription>
                            Customize your text appearance and styling.
                        </DrawerDescription>
                    </DrawerHeader>
                    <ControlPanel />
                </DrawerContent>
            </Drawer>

            <div className="flex-1 max-w-xs bg-background/95 backdrop-blur-sm border rounded-lg px-2.5 py-2">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-muted-foreground min-w-[2ch] whitespace-nowrap w-full text-center absolute -top-6">
                        {getWeightLabel(weight)}
                    </span>
                    <div className="flex-1 relative group">
                        <Slider
                            min={100}
                            max={900}
                            step={100}
                            value={[parseInt(weight)]}
                            onValueChange={handleWeightChange}
                            className="flex-1 transition-all duration-150 group-hover:scale-y-110 z-10"
                        />

                        <div className="absolute -bottom-1 left-0 right-0 flex justify-between px-1">
                            {[100, 200, 300, 400, 500, 600, 700, 800, 900].map(
                                (w) => (
                                    <div
                                        key={w}
                                        className={`w-0.5 h-0.5 rounded-full transition-all duration-200 ${
                                            parseInt(weight) === w
                                                ? "bg-primary scale-150"
                                                : "bg-muted-foreground/30"
                                        }`}
                                    />
                                ),
                            )}
                        </div>
                    </div>
                    <span className="text-xs font-mono text-muted-foreground min-w-[2ch] text-center">
                        {weight}
                    </span>
                </div>
            </div>

            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        size="sm"
                        variant="outline"
                        className="bg-background hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
                    >
                        <Share2 className="h-4 w-4" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-2" align="end">
                    <div className="flex flex-col gap-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleShareUrl}
                            className="justify-start gap-2"
                        >
                            <Link className="h-4 w-4" />
                            Share URL
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleCopyImage}
                            className="justify-start gap-2"
                        >
                            <Clipboard className="h-4 w-4" />
                            Copy Image
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleDownload}
                            className="justify-start gap-2"
                        >
                            <Download className="h-4 w-4" />
                            Download
                        </Button>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
};
