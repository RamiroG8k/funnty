import { useTextConfig } from "@/context/textConfig";
import { useCallback, useEffect, useRef } from "react";
import { QuickActions } from "../../../views/Home/QuickActions";
import { drawTextWithLetterSpacing, wrapText } from "./canvasTextUtils";
import { cn } from "@/lib/utils";
import AlignmentToggle from "../alignment-toggle";
import ShareOptions from "../ShareOptions";
import FontSelector from "../font-selector";

const PADDING = 40;

type TextCanvasProps = {
    className?: string;
};

export const TextCanvas: React.FC<TextCanvasProps> = (props) => {
    const { className } = props;
    const { ...config } = useTextConfig();

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const drawText = useCallback(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;

        if (!canvas || !container) return;

        const canvasRenderingContext = canvas.getContext("2d")!;
        const containerRect = container.getBoundingClientRect();
        const DPR = window.devicePixelRatio || 1;

        // Set canvas size
        canvas.width = containerRect.width * DPR;
        canvas.height = containerRect.height * DPR;
        canvas.style.width = `${containerRect.width}px`;
        canvas.style.height = `${containerRect.height}px`;

        canvasRenderingContext.scale(DPR, DPR);
        canvasRenderingContext.clearRect(
            0,
            0,
            containerRect.width,
            containerRect.height,
        );

        // Set font and text properties
        canvasRenderingContext.font = `${config.weight} ${config.size}px "${config.font}", Arial, sans-serif`;
        canvasRenderingContext.fillStyle = config.color;
        canvasRenderingContext.strokeStyle = config.strokeColor;
        canvasRenderingContext.lineWidth = config.strokeWidth;
        canvasRenderingContext.textBaseline = "middle";

        // Handle text wrapping and alignment
        const lines = wrapText(
            canvasRenderingContext,
            config.text,
            containerRect.width - PADDING,
        );
        const lineHeight = config.size * config.lineHeight;

        // Center position
        const centerX = containerRect.width / 2;
        const centerY = containerRect.height / 2;

        canvasRenderingContext.save();
        canvasRenderingContext.translate(centerX, centerY);

        // Draw each line
        lines.forEach((line, index) => {
            const y = (index - (lines.length - 1) / 2) * lineHeight;
            let x = 0;

            if (config.alignment === "center") {
                canvasRenderingContext.textAlign = "center";
            } else if (config.alignment === "right") {
                canvasRenderingContext.textAlign = "right";
                x = (containerRect.width - PADDING) / 2;
            } else {
                canvasRenderingContext.textAlign = "left";
                x = -(containerRect.width - PADDING) / 2;
            }

            // Draw stroke if enabled
            if (config.strokeWidth > 0) {
                drawTextWithLetterSpacing(
                    canvasRenderingContext,
                    line,
                    x,
                    y,
                    config.letterSpacing,
                    "stroke",
                );
            }

            // Draw fill
            drawTextWithLetterSpacing(
                canvasRenderingContext,
                line,
                x,
                y,
                config.letterSpacing,
                "fill",
            );
        });

        canvasRenderingContext.restore();
    }, [config]);

    useEffect(() => {
        drawText();
    }, [drawText]);

    return (
        <div
            ref={containerRef}
            className={cn("bg-gray-50 border rounded-lg", className)}
            style={{
                backgroundImage: `
                    radial-gradient(circle at 1px 1px, rgba(0,0,0,0.075) 1px, transparent 0)
                `,
                backgroundSize: "30px 30px",
                backgroundPosition: "50%",
            }}
        >
            <div className="flex gap-2 absolute top-3 z-10">
                <AlignmentToggle />

                <FontSelector />

                <ShareOptions canvas={canvasRef.current} />
            </div>

            <canvas
                ref={canvasRef}
                style={{
                    height: containerRef.current?.clientHeight,
                    width: containerRef.current?.clientWidth,
                }}
            />

            <QuickActions />
        </div>
    );
};
