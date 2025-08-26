import { useTextConfig } from "@/context/textConfig";
import { type GoogleFontKey, useGoogleFonts } from "@/hooks/useGoogleFonts";
import { useEffect } from "react";
import FontOptions from "./FontOptions";
import { TextCanvas } from "@/components/organisms/TextCanvas";
import InputField from "@/components/molecules/input-field";

export const Home: React.FC = () => {
    const { loadFont } = useGoogleFonts();
    const { updateConfig, ...config } = useTextConfig();

    useEffect(() => {
        loadFont(config.font as GoogleFontKey);
    }, [config.font]);

    return (
        <main className="grid grid-cols-1 lg:grid-cols-4 place-items-start gap-4 p-4">
            <div className="h-[75svh] lg:h-[calc(100svh-2rem)] w-full lg:col-span-3 relative flex justify-center">
                <FontOptions
                    className="absolute top-3 z-10 [&>div]:bg-red-300"
                    onFontChange={loadFont}
                />

                <TextCanvas className="h-full w-full grow-0" />
            </div>

            <InputField
                className="h-fit w-full [&>textarea,&>input]:bg-background z-10"
                cols={3}
                id="textArea"
                label="Custom text"
                onChange={(text) => updateConfig({ text })}
                placeholder="Enter your text here..."
                value={config.text}
            />
        </main>
    );
};
