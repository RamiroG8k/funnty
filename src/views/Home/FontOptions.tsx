import { Button } from "@/components/atoms/button";
import { Combobox } from "@/components/molecules/combobox";
import { useTextConfig } from "@/context/textConfig";
import { getFontOptions, type GoogleFontKey } from "@/hooks/useGoogleFonts";
import { cn } from "@/lib/utils";
import { AlignCenter, AlignLeft, AlignRight } from "lucide-react";

interface FontOptionsProps {
    className?: string;
    onFontChange: (value: GoogleFontKey) => void;
}

const FontOptions: React.FC<FontOptionsProps> = (props) => {
    const { className, onFontChange } = props;
    const { alignment, updateConfig, ...config } = useTextConfig();

    const handleAlignmentChange = () => {
        updateConfig({
            alignment:
                alignment === "left"
                    ? "center"
                    : alignment === "center"
                      ? "right"
                      : "left",
        });
    };

    return (
        <div className={cn("flex gap-2", className)}>
            <Button variant="outline" onClick={handleAlignmentChange} size="sm">
                {alignment === "center" ? (
                    <AlignCenter />
                ) : alignment === "left" ? (
                    <AlignLeft />
                ) : (
                    <AlignRight />
                )}
            </Button>

            <Combobox
                onChange={(value) => {
                    onFontChange(value as GoogleFontKey);
                    updateConfig({ font: value });
                }}
                options={getFontOptions()}
                value={config.font}
            />
        </div>
    );
};

export default FontOptions;
