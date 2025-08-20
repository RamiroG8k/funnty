import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../atoms/select";
import { Textarea } from "../atoms/textarea";
import { Label } from "../atoms/label";
import { Slider } from "../atoms/slider";
import { Input } from "../atoms/input";
import { ToggleGroup, ToggleGroupItem } from "../atoms/toggle-group";

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

// Popular Google Fonts
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

export const ControlPanel: React.FC<{
    config: TextConfig;
    onConfigChange: (config: Partial<TextConfig>) => void;
    onLoadFont: (font: string) => void;
}> = ({ config, onConfigChange, onLoadFont }) => {
    const handleLoadFont = (font: string) => {
        onConfigChange({ font });
        onLoadFont(font);
    };

    return (
        <div className="bg-white border-t p-4 space-y-4">
            <div className="flex gap-4">
                <div className="grid w-full max-w-sm items-center gap-3">
                    <Label className="text-sm" htmlFor="textArea">
                        Size: {config.size}px
                    </Label>
                    <Slider
                        min={12}
                        max={200}
                        value={[config.size]}
                        step={2}
                        onValueChange={([value]) =>
                            onConfigChange({ size: value })
                        }
                    />
                </div>

                <div className="grid w-full max-w-sm items-center gap-3">
                    <Label className="text-sm" htmlFor="textArea">
                        Size: {config.weight}px
                    </Label>
                    <Slider
                        min={100}
                        max={900}
                        value={[config.weight]}
                        step={100}
                        onValueChange={([value]) =>
                            onConfigChange({ weight: value })
                        }
                    />
                </div>
            </div>

            {/* Colors */}
            <div className="grid grid-cols-2 gap-4">
                <div className="grid w-full max-w-sm items-center gap-3">
                    <Label className="text-sm" htmlFor="fill-color">
                        Text Color
                    </Label>
                    <Input
                        id="fill-color"
                        type="color"
                        value={config.color}
                        onChange={(e) =>
                            onConfigChange({ color: e.target.value })
                        }
                    />
                </div>

                <div className="grid w-full max-w-sm items-center gap-3">
                    <Label className="text-sm" htmlFor="stroke-color">
                        Stroke Color
                    </Label>
                    <Input
                        id="stroke-color"
                        type="color"
                        value={config.strokeColor}
                        onChange={(e) =>
                            onConfigChange({ strokeColor: e.target.value })
                        }
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Stroke Width: {config.strokeWidth}
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="10"
                        step="0.5"
                        value={config.strokeWidth}
                        onChange={(e) =>
                            onConfigChange({
                                strokeWidth: parseFloat(e.target.value),
                            })
                        }
                        className="w-full"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Letter Spacing: {config.letterSpacing}
                    </label>
                    <input
                        type="range"
                        min="-2"
                        max="10"
                        step="0.1"
                        value={config.letterSpacing}
                        onChange={(e) =>
                            onConfigChange({
                                letterSpacing: parseFloat(e.target.value),
                            })
                        }
                        className="w-full"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">
                    Text Alignment
                </label>
                <div className="flex gap-2">
                    <ToggleGroup
                        variant="outline"
                        type="single"
                        size="sm"
                        onValueChange={(
                            alignment: "left" | "center" | "right",
                        ) => onConfigChange({ alignment })}
                    >
                        <ToggleGroupItem value="left">Left</ToggleGroupItem>
                        <ToggleGroupItem value="center">Center</ToggleGroupItem>
                        <ToggleGroupItem value="right">Right</ToggleGroupItem>
                    </ToggleGroup>
                </div>
            </div>
        </div>
    );
};
