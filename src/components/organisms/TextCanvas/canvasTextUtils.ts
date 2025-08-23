import { TextConfig } from "@/context/textConfig";
import { DEFAULT_TEXT_CONFIG } from "@/context/textConfig/textConfig";

export const wrapText = (
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

export const drawTextWithLetterSpacing = (
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

export async function copyCanvasAsImage(canvas: HTMLCanvasElement) {
    if (!canvas) return;

    const blob: Blob | null = await new Promise((resolve) =>
        canvas.toBlob(resolve, "image/png"),
    );

    if (!blob) {
        alert("Failed to get image data from canvas");
        return;
    }

    let data: ClipboardItem;

    try {
        data = new window.ClipboardItem({ [blob.type]: blob });

        await navigator.clipboard.write([data]);

        alert("Image copied to clipboard");

        return;
    } catch (err) {
        console.warn(
            "navigator.clipboard.write with ClipboardItem failed",
            err,
        );
    }

    try {
        const dataUrl = canvas.toDataURL("image/png");

        await navigator.clipboard.writeText(dataUrl);

        void alert("Image data URL copied to clipboard (fallback)");
    } catch (err) {
        console.error("fallback copy failed", err);
        void alert("Copy to clipboard failed");
    }
}

export function downloadCanvasAsImage(
    canvas: HTMLCanvasElement,
    filename: string = "funnty-design",
) {
    if (!canvas) return;

    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `${filename}.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

export function shareUrl(textConfig: TextConfig) {
    const params = new URLSearchParams();

    // Only include non-default values to keep URL clean
    Object.entries(textConfig).forEach(([key, value]) => {
        if (value !== DEFAULT_TEXT_CONFIG[key as keyof TextConfig]) {
            params.set(key, String(value));
        }
    });

    const shareUrl = `${window.location.origin}${window.location.pathname}?${params.toString()}`;

    if (navigator.share) {
        navigator
            .share({
                title: "Check out this text design!",
                text: "I created this cool text design with Funnty",
                url: shareUrl,
            })
            .catch(console.error);
    } else {
        navigator.clipboard
            .writeText(shareUrl)
            .then(() => {
                alert("Share URL copied to clipboard!");
            })
            .catch(() => {
                alert("Failed to copy URL to clipboard");
            });
    }
}
