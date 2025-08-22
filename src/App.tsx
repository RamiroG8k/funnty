import { useEffect, useCallback } from "react";
import { useGoogleFonts } from "./hooks/useGoogleFonts/useGoogleFonts";
import { TextCanvas } from "./components/organisms/TextCanvas";
import { ControlPanel } from "./components/organisms/ControlPanel";
import { Button } from "./components/atoms/button";
import { Clipboard, Settings } from "lucide-react";
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "./components/molecules/drawer";
import { Textarea } from "./components/atoms/textarea";
import { Label } from "./components/atoms/label";
import FontOptions from "./views/Home/FontOptions";
import { useTextConfig } from "./context/textConfig";

// Main App Component
const TextCanvasApp: React.FC = () => {
    const { loadFont, isLoading } = useGoogleFonts();
    const { updateConfig, ...config } = useTextConfig();

    const copyAsPNG = useCallback(async () => {
        // Create a temporary canvas for export with high quality
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d")!;

        // Set high DPI scaling for better quality
        const scale = window.devicePixelRatio || 2;

        // Set font for initial measurements
        ctx.font = `${config.weight} ${config.size}px "${config.font}", Arial, sans-serif`;
        ctx.textBaseline = "middle";

        // Measure text
        const lines = config.text.split("\n").filter((line) => line.length > 0);
        const lineHeight = config.size * config.lineHeight;
        const maxWidth = Math.max(
            ...lines.map((line) => ctx.measureText(line).width),
        );
        const totalHeight = lines.length * lineHeight;

        // Set canvas size with padding and high DPI scaling
        const canvasWidth = maxWidth + config.padding * 2;
        const canvasHeight = totalHeight + config.padding * 2;

        canvas.width = canvasWidth * scale;
        canvas.height = canvasHeight * scale;
        canvas.style.width = canvasWidth + "px";
        canvas.style.height = canvasHeight + "px";

        // Scale context for high DPI
        ctx.scale(scale, scale);

        // Redraw with proper scaling and anti-aliasing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.font = `${config.weight} ${config.size}px "${config.font}", Arial, sans-serif`;
        ctx.fillStyle = config.color;
        ctx.strokeStyle = config.strokeColor;
        ctx.lineWidth = config.strokeWidth;
        ctx.textBaseline = "middle";

        // Draw text
        const centerX = canvasWidth / 2;
        const startY = config.padding + config.size / 2;

        lines.forEach((line, index) => {
            const y = startY + index * lineHeight;
            let x = config.padding;

            if (config.alignment === "center") {
                ctx.textAlign = "center";
                x = centerX;
            } else if (config.alignment === "right") {
                ctx.textAlign = "right";
                x = canvasWidth - config.padding;
            } else {
                ctx.textAlign = "left";
            }

            if (config.strokeWidth > 0) {
                ctx.strokeText(line, x, y);
            }
            ctx.fillText(line, x, y);
        });

        // Copy to clipboard
        canvas.toBlob(
            async (blob) => {
                if (!blob) return;

                try {
                    await navigator.clipboard.write([
                        new ClipboardItem({
                            "image/png": blob,
                        }),
                    ]);
                } catch (error) {
                    console.error("Failed to copy image to clipboard:", error);
                    // Fallback: create download link
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `${config.font.replace(/\s+/g, "-").toLowerCase()}-text.png`;
                    a.click();
                    URL.revokeObjectURL(url);
                }
            },
            "image/png",
            1.0,
        );
    }, [config]);

    // Load initial font
    useEffect(() => {
        loadFont(config.font);
    }, []);

    const handleLoadFont = (font: string) => {
        loadFont(font);
    };

    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-1 flex flex-col lg:flex-row gap-4 p-4">
                <div className="lg:w-5/6 relative flex justify-center">
                    <FontOptions onFontChange={handleLoadFont} />

                    <TextCanvas config={config} />

                    <Drawer>
                        <DrawerTrigger
                            className="left-3 bottom-3 absolute"
                            asChild
                        >
                            <Button
                                onClick={() => {}}
                                variant="outline"
                                size="sm"
                            >
                                <Settings />
                            </Button>
                        </DrawerTrigger>
                        <DrawerContent>
                            <DrawerHeader>
                                <DrawerTitle>Text settings</DrawerTitle>
                                <DrawerDescription>
                                    This action cannot be undone.
                                </DrawerDescription>
                            </DrawerHeader>

                            <ControlPanel />
                        </DrawerContent>
                    </Drawer>

                    <Button
                        className="bg-background right-3 bottom-3 absolute"
                        onClick={copyAsPNG}
                        size="sm"
                        variant="outline"
                    >
                        <Clipboard />
                    </Button>
                </div>

                <div className="grid h-fit lg:w-1/6 gap-3">
                    <Label className="text-sm" htmlFor="textArea">
                        Custom text
                    </Label>

                    <Textarea
                        id="textArea"
                        cols={3}
                        value={config.text}
                        onChange={(e) => updateConfig({ text: e.target.value })}
                        placeholder="Enter your text here..."
                    />
                </div>
            </main>
        </div>
    );
};

export default TextCanvasApp;
