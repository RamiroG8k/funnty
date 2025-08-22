import { useTextConfig } from "@/context/textConfig";
import {
    GoogleFontKey,
    useGoogleFonts,
} from "@/hooks/useGoogleFonts/useGoogleFonts";
import { useEffect } from "react";
import FontOptions from "./FontOptions";
import { TextCanvas } from "@/components/organisms/TextCanvas";
import InputField from "@/components/molecules/input-field";

export const Home: React.FC = () => {
    const { loadFont } = useGoogleFonts();
    const { updateConfig, ...config } = useTextConfig();

    useEffect(() => {
        loadFont(config.font as GoogleFontKey);
    }, [loadFont, config.font]);

    const handleLoadFont = (font: GoogleFontKey) => {
        loadFont(font);
    };

    return (
        <main className="relative min-h-screen flex-1 flex flex-col lg:flex-row gap-4 p-4 overflow-hidden">
            <div className="relative h-[75dvh] lg:h-[calc(100dvh-2rem)] grow-0 lg:w-4/5 flex justify-center">
                <FontOptions
                    className="absolute top-3 z-10 [&>div]:bg-red-300"
                    onFontChange={handleLoadFont}
                />

                <TextCanvas />
            </div>

            <InputField
                className="w-full lg:w-1/5 [&>textarea,&>input]:bg-background shrink-0"
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
