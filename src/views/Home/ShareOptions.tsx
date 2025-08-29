import { Share2, Link, Clipboard, Download } from "lucide-react";
import { useTextConfig } from "@/context/textConfig";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/atoms/popover";
import { Button } from "@/components/atoms/button";
import {
    copyCanvasAsImage,
    downloadCanvasAsImage,
    shareUrl,
} from "./TextCanvas/canvasTextUtils";
import { TextConfig } from "@/context/textConfig/types";

type ShareOptionsProps = {
    canvas: HTMLCanvasElement | null;
};

const ShareOptions: React.FC<ShareOptionsProps> = ({ canvas }) => {
    const textConfigData = useTextConfig();
    const { ...config } = textConfigData;

    const handleShareUrl = () => {
        // Only pass text configuration, not canvas or functions
        const textOnlyConfig: TextConfig = {
            text: config.text,
            font: config.font,
            size: config.size,
            weight: config.weight,
            color: config.color,
            strokeWidth: config.strokeWidth,
            strokeColor: config.strokeColor,
            letterSpacing: config.letterSpacing,
            lineHeight: config.lineHeight,
            alignment: config.alignment,
        };
        shareUrl(textOnlyConfig);
    };

    const handleDownload = () => {
        if (canvas) {
            downloadCanvasAsImage(canvas, "funnty-design");
        } else {
            console.warn("Canvas not available for download");
        }
    };

    const handleCopyImage = async () => {
        if (canvas) {
            try {
                await copyCanvasAsImage(canvas);
            } catch (error) {
                console.error("Failed to copy image:", error);
            }
        } else {
            console.warn("Canvas not available for copying");
        }
    };

    return (
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
    );
};

export default ShareOptions;
