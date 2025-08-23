import { Label } from "../atoms/label";
import { Slider } from "../atoms/slider";
import { Input } from "../atoms/input";
import { useTextConfig } from "@/context/textConfig";

export const ControlPanel: React.FC = () => {
    const { updateConfig, ...config } = useTextConfig();

    return (
        <div className="grid bg-white border-t p-4 space-y-4 pb-16">
            <div className="grid w-full items-center gap-3">
                <Label className="text-sm" htmlFor="textArea">
                    Size: {config.size}px
                </Label>

                <div className="flex gap-2">
                    <Slider
                        min={1}
                        max={200}
                        value={[config.size]}
                        step={1}
                        onValueChange={([value]) =>
                            updateConfig({ size: value })
                        }
                    />
                    <Input
                        className="size-8 p-0 aspect-square shrink-0"
                        id="stroke-color"
                        type="color"
                        value={config.color}
                        onChange={(e) =>
                            updateConfig({ color: e.target.value })
                        }
                    />
                </div>
            </div>

            <div className="grid w-full items-center gap-3">
                <Label className="text-sm" htmlFor="fill-color">
                    Stroke Size: {config.strokeWidth}px
                </Label>

                <div className="flex gap-2">
                    <Slider
                        min={-2}
                        max={20}
                        value={[config.strokeWidth]}
                        step={0.5}
                        onValueChange={([value]) =>
                            updateConfig({
                                strokeWidth: value,
                            })
                        }
                    />
                    <Input
                        className="size-8 p-0 aspect-square shrink-0"
                        id="stroke-color"
                        type="color"
                        value={config.strokeColor}
                        onChange={(e) =>
                            updateConfig({ strokeColor: e.target.value })
                        }
                    />
                </div>
            </div>

            {/*TODO: Fix misalignment when letter spacing applied and alignment*/}
            {/*<div className="grid w-full items-center gap-3">
                <Label className="text-sm" htmlFor="textArea">
                    Letter Spacing: {config.letterSpacing}
                </Label>
                <Slider
                    min={-20}
                    max={20}
                    value={[config.letterSpacing]}
                    step={0.1}
                    onValueChange={([value]) =>
                        updateConfig({
                            letterSpacing: value,
                        })
                    }
                />
            </div>*/}

            <div className="grid w-full items-center gap-3">
                <Label className="text-sm" htmlFor="textArea">
                    Line height: {config.lineHeight}
                </Label>
                <Slider
                    min={-2}
                    max={2}
                    value={[config.lineHeight]}
                    step={0.25}
                    onValueChange={([value]) =>
                        updateConfig({
                            lineHeight: value,
                        })
                    }
                />
            </div>
        </div>
    );
};
