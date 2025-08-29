import { Button } from "@/components/atoms/button";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/molecules/drawer";
import InputField from "@/components/molecules/input-field";
import { useTextConfig } from "@/context/textConfig";
import { cn } from "@/lib/utils";
import { useState } from "react";

const ColorSelector: React.FC = () => {
    const { updateConfig, ...config } = useTextConfig();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
            <DrawerTrigger asChild>
                <Button
                    size="sm"
                    className="aspect-square shrink-0"
                    variant="outline"
                    onClick={() => {}}
                >
                    <span
                        className="aspect-square size-3 rounded-full outline-2 outline-offset-2"
                        style={{
                            backgroundColor: config.color,
                            outlineColor: config.strokeColor,
                        }}
                    />
                </Button>
            </DrawerTrigger>

            <DrawerContent className="group/drawer-content pb-4">
                <span
                    aria-hidden="true"
                    className={cn(
                        "absolute -top-[40svh] w-fit left-1/2 -translate-x-1/2",
                        "text-9xl font-bold pointer-events-none z-10",
                        "transition-[opacity,scale] duration-300 ease-in-out",
                        isOpen ? "opacity-100 scale-100" : "opacity-0 scale-0",
                    )}
                    style={{
                        fontFamily: "Arial",
                        color: config.color,
                        WebkitTextStroke: `5px ${config.strokeColor}`,
                    }}
                >
                    A
                </span>

                <DrawerHeader>
                    <DrawerTitle>Are you absolutely sure?</DrawerTitle>
                    <DrawerDescription>
                        This action cannot be undone.
                    </DrawerDescription>
                </DrawerHeader>

                <div className="flex flex-col gap-4 p-4">
                    <InputField
                        className="[&>input]:p-0.5 md:[&>input]:p-1"
                        label="Fill color"
                        type="color"
                        onChange={(color) => updateConfig({ color })}
                        value={config.color}
                    />

                    <InputField
                        className="[&>input]:p-0.5 md:[&>input]:p-1"
                        label="Stroke color"
                        type="color"
                        onChange={(color) =>
                            updateConfig({ strokeColor: color })
                        }
                        value={config.strokeColor}
                    />
                </div>

                <DrawerFooter>
                    <DrawerClose asChild>
                        <Button>Save and Close</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
};

export default ColorSelector;
