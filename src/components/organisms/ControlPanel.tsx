import { Label } from "../atoms/label";
import { Slider } from "../atoms/slider";
import { Input } from "../atoms/input";
import { ToggleGroup, ToggleGroupItem } from "../atoms/toggle-group";
import { useTextConfig } from "@/context/textConfig";

export const ControlPanel: React.FC = () => {
    const { updateConfig, ...config } = useTextConfig();

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
                            updateConfig({ size: value })
                        }
                    />
                </div>

                <div className="grid w-full max-w-sm items-center gap-3">
                    <Label className="text-sm" htmlFor="textArea">
                        Weight: {config.weight}px
                    </Label>
                    <Slider
                        min={100}
                        max={900}
                        value={[parseInt(config.weight)]}
                        step={100}
                        onValueChange={([value]) =>
                            updateConfig({ weight: value.toString() })
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
                            updateConfig({ color: e.target.value })
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
                            updateConfig({ strokeColor: e.target.value })
                        }
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="grid w-full max-w-sm items-center gap-3">
                    <Label className="text-sm" htmlFor="textArea">
                        Stroke Width: {config.strokeWidth}
                    </Label>
                    <Slider
                        min={0}
                        max={10}
                        value={[config.strokeWidth]}
                        step={0.5}
                        onValueChange={([value]) =>
                            updateConfig({
                                strokeWidth: value,
                            })
                        }
                    />
                </div>
                <div className="grid w-full max-w-sm items-center gap-3">
                    <Label className="text-sm" htmlFor="textArea">
                        Letter Spacing: {config.letterSpacing}
                    </Label>
                    <Slider
                        min={-5}
                        max={10}
                        value={[config.letterSpacing]}
                        step={0.1}
                        onValueChange={([value]) =>
                            updateConfig({
                                letterSpacing: value,
                            })
                        }
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
                        ) => updateConfig({ alignment })}
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
