import React, { useState, useEffect, useCallback } from "react";
import { useGoogleFonts } from "./hooks/useGoogleFonts/useGoogleFonts";
import { TextCanvas } from "./components/organisms/TextCanvas";
import { ControlPanel } from "./components/organisms/ControlPanel";
import { Button } from "./components/atoms/button";
import { Download, Settings } from "lucide-react";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "./components/molecules/drawer";
import { Textarea } from "./components/atoms/textarea";
import { Label } from "./components/atoms/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./components/atoms/select";

// Types
interface TextConfig {
    text: string;
    font: string;
    size: number;
    weight: number;
    color: string;
    strokeWidth: number;
    strokeColor: string;
    letterSpacing: number;
    lineHeight: number;
    padding: number;
    scale: number;
    rotation: number;
    alignment: "left" | "center" | "right";
    maxWidth: number;
}

const POPULAR_FONTS = [
    "Inter",
    "Roboto",
    "Montserrat",
    "Poppins",
    "Open Sans",
    "Lato",
    "Source Sans 3",
    "Oswald",
    "Raleway",
    "Nunito",
    "Noto Sans",
    "Noto Serif",
    "Playfair Display",
    "Merriweather",
    "Work Sans",
    "Fira Sans",
    "Quicksand",
    "Kanit",
    "Rubik",
    "Archivo",
    "Manrope",
    "Space Grotesk",
    "DM Sans",
    "IBM Plex Sans",
    "Bebas Neue",
    "Dancing Script",
    "Permanent Marker",
    "Abril Fatface",
    "Titillium Web",
    "Overpass",
];

// Main App Component
const TextCanvasApp: React.FC = () => {
    const { loadFont, isLoading } = useGoogleFonts();
    const [config, setConfig] = useState<TextConfig>({
        text: "Your awesome text here!",
        font: "Inter",
        size: 72,
        weight: 700,
        color: "#111827",
        strokeWidth: 0,
        strokeColor: "#000000",
        letterSpacing: 0,
        lineHeight: 1.2,
        padding: 20,
        scale: 1,
        rotation: 0,
        alignment: "center",
        maxWidth: 0,
    });

    const updateConfig = useCallback((updates: Partial<TextConfig>) => {
        setConfig((prev) => ({ ...prev, ...updates }));
    }, []);

    const exportPNG = useCallback(async () => {
        // Create a temporary canvas for export
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d")!;

        // Set font
        ctx.font = `${config.weight} ${config.size}px "${config.font}", Arial, sans-serif`;
        ctx.textBaseline = "middle";

        // Measure text
        const lines = config.text.split("\n").filter((line) => line.length > 0);
        const lineHeight = config.size * config.lineHeight;
        const maxWidth = Math.max(
            ...lines.map((line) => ctx.measureText(line).width),
        );
        const totalHeight = lines.length * lineHeight;

        // Set canvas size with padding
        canvas.width = maxWidth + config.padding * 2;
        canvas.height = totalHeight + config.padding * 2;

        // Redraw with proper scaling
        ctx.font = `${config.weight} ${config.size}px "${config.font}", Arial, sans-serif`;
        ctx.fillStyle = config.color;
        ctx.strokeStyle = config.strokeColor;
        ctx.lineWidth = config.strokeWidth;
        ctx.textBaseline = "middle";

        // Draw text
        const centerX = canvas.width / 2;
        const startY = config.padding + config.size / 2;

        lines.forEach((line, index) => {
            const y = startY + index * lineHeight;
            let x = config.padding;

            if (config.alignment === "center") {
                ctx.textAlign = "center";
                x = centerX;
            } else if (config.alignment === "right") {
                ctx.textAlign = "right";
                x = canvas.width - config.padding;
            } else {
                ctx.textAlign = "left";
            }

            if (config.strokeWidth > 0) {
                ctx.strokeText(line, x, y);
            }
            ctx.fillText(line, x, y);
        });

        // Download
        canvas.toBlob((blob) => {
            if (!blob) return;
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${config.font.replace(/\s+/g, "-").toLowerCase()}-text.png`;
            a.click();
            URL.revokeObjectURL(url);
        }, "image/png");
    }, [config]);

    // Load initial font
    useEffect(() => {
        loadFont(config.font);
    }, []);

    const handleLoadFont = (font: string) => {
        updateConfig({ font });
        loadFont(font);
    };

    return (
        <div className="min-h-screen flex flex-col">
            <header className="bg-white border-b px-4 py-3">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold">Text Canvas</h1>

                    <Button onClick={exportPNG} variant="outline">
                        <Download />
                    </Button>
                </div>
            </header>

            <main className="flex-1 flex flex-col lg:flex-row gap-4 p-4">
                <div className="lg:w-5/6 relative">
                    <TextCanvas config={config} />

                    <Drawer>
                        <DrawerTrigger className="right-6 bottom-6 absolute">
                            <Button onClick={() => {}} variant="outline">
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

                            <ControlPanel
                                config={config}
                                onConfigChange={updateConfig}
                                onLoadFont={loadFont}
                            />
                        </DrawerContent>
                    </Drawer>
                </div>

                <div className="grid h-fit lg:w-1/6 gap-3">
                    <div className="flex justify-between items-end">
                        <Label className="text-sm" htmlFor="textArea">
                            Custom text
                        </Label>
                        <Select
                            value={config.font}
                            onValueChange={handleLoadFont}
                        >
                            <SelectTrigger className="w-fit" size="sm">
                                <SelectValue placeholder="Font" />
                            </SelectTrigger>
                            <SelectContent>
                                {POPULAR_FONTS.map((font) => (
                                    <SelectItem
                                        key={font}
                                        value={font}
                                        style={{
                                            fontFamily: `"${font}", Arial, sans-serif`,
                                        }}
                                    >
                                        {font}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <Textarea
                        id="textArea"
                        cols={3}
                        value={config.text}
                        onChange={(e) => updateConfig({ text: e.target.value })}
                        placeholder="Enter your text here..."
                    />
                </div>
            </main>

            {isLoading && (
                <div className="fixed top-4 right-4 bg-blue-500 text-white px-3 py-2 rounded-md text-sm">
                    Loading font...
                </div>
            )}
        </div>
    );
};

export default TextCanvasApp;
