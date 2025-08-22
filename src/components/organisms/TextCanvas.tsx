import React, { useCallback, useEffect, useRef } from "react";

interface TextConfig {
    text: string;
    font: string;
    size: number;
    weight: string;
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

export const TextCanvas: React.FC<{
    config: TextConfig;
}> = ({ config }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const drawText = useCallback(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const ctx = canvas.getContext("2d")!;
        const rect = container.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;

        // Set canvas size
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;

        ctx.scale(dpr, dpr);
        ctx.clearRect(0, 0, rect.width, rect.height);

        // Set font and text properties
        ctx.font = `${config.weight} ${config.size}px "${config.font}", Arial, sans-serif`;
        ctx.fillStyle = config.color;
        ctx.strokeStyle = config.strokeColor;
        ctx.lineWidth = config.strokeWidth;
        ctx.textBaseline = "middle";

        // Handle text wrapping and alignment
        const lines = wrapText(
            ctx,
            config.text,
            config.maxWidth || rect.width - 40,
        );
        const lineHeight = config.size * config.lineHeight;

        // Calculate total text height
        // const totalHeight = lines.length * lineHeight;

        // Center position
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate((config.rotation * Math.PI) / 180);
        ctx.scale(config.scale, config.scale);

        // Draw each line
        lines.forEach((line, index) => {
            const y = (index - (lines.length - 1) / 2) * lineHeight;
            let x = 0;

            if (config.alignment === "center") {
                ctx.textAlign = "center";
            } else if (config.alignment === "right") {
                ctx.textAlign = "right";
                x = (config.maxWidth || rect.width - 40) / 2;
            } else {
                ctx.textAlign = "left";
                x = -(config.maxWidth || rect.width - 40) / 2;
            }

            // Draw stroke if enabled
            if (config.strokeWidth > 0) {
                drawTextWithLetterSpacing(
                    ctx,
                    line,
                    x,
                    y,
                    config.letterSpacing,
                    "stroke",
                );
            }

            // Draw fill
            drawTextWithLetterSpacing(
                ctx,
                line,
                x,
                y,
                config.letterSpacing,
                "fill",
            );
        });

        ctx.restore();
    }, [config]);

    // Helper function to wrap text
    const wrapText = (
        ctx: CanvasRenderingContext2D,
        text: string,
        maxWidth: number,
    ): string[] => {
        if (!maxWidth || maxWidth <= 0)
            return text.split("\n").filter((line) => line.length > 0);

        const lines: string[] = [];
        const paragraphs = text.split("\n");

        paragraphs.forEach((paragraph) => {
            if (!paragraph.trim()) {
                lines.push("");
                return;
            }

            const words = paragraph.split(" ");
            let currentLine = "";

            words.forEach((word) => {
                const testLine = currentLine ? `${currentLine} ${word}` : word;
                const metrics = ctx.measureText(testLine);

                if (metrics.width > maxWidth && currentLine) {
                    lines.push(currentLine);
                    currentLine = word;
                } else {
                    currentLine = testLine;
                }
            });

            if (currentLine) {
                lines.push(currentLine);
            }
        });

        return lines;
    };

    // Helper function to draw text with letter spacing
    const drawTextWithLetterSpacing = (
        ctx: CanvasRenderingContext2D,
        text: string,
        x: number,
        y: number,
        letterSpacing: number,
        type: "fill" | "stroke",
    ) => {
        if (letterSpacing === 0) {
            if (type === "fill") {
                ctx.fillText(text, x, y);
            } else {
                ctx.strokeText(text, x, y);
            }
            return;
        }

        let currentX = x;
        for (const char of text) {
            if (type === "fill") {
                ctx.fillText(char, currentX, y);
            } else {
                ctx.strokeText(char, currentX, y);
            }
            currentX += ctx.measureText(char).width + letterSpacing;
        }
    };

    useEffect(() => {
        drawText();
    }, [drawText]);

    return (
        <div
            ref={containerRef}
            className="flex-1 h-[70dvh] lg:h-full w-full bg-gray-50 border rounded-lg overflow-hidden"
        >
            <canvas ref={canvasRef} className="w-full h-full" />
        </div>
    );
};
