import { useEffect } from "react";
import {
    GoogleFontKey,
    useGoogleFonts,
} from "./hooks/useGoogleFonts/useGoogleFonts";
import { TextCanvas } from "./components/organisms/TextCanvas";
import { Textarea } from "./components/atoms/textarea";
import { Label } from "./components/atoms/label";
import FontOptions from "./views/Home/FontOptions";
import { useTextConfig } from "./context/textConfig";

// Main App Component
const TextCanvasApp: React.FC = () => {
    const { loadFont } = useGoogleFonts();
    const { updateConfig, ...config } = useTextConfig();

    useEffect(() => {
        loadFont(config.font as GoogleFontKey);
    }, [loadFont, config.font]);

    const handleLoadFont = (font: GoogleFontKey) => {
        loadFont(font);
    };

    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-1 flex flex-col lg:flex-row gap-4 p-4">
                <div className="flex-1 lg:w-5/6 relative flex justify-center">
                    <FontOptions onFontChange={handleLoadFont} />

                    <TextCanvas />
                </div>

                <div className="grid h-fit lg:w-1/6 gap-2">
                    <Label className="text-sm" htmlFor="textArea">
                        Custom text
                    </Label>

                    <Textarea
                        id="textArea"
                        cols={3}
                        value={config.text}
                        onChange={(e) => updateConfig({ text: e.target.value })}
                        placeholder="Enter your text here..."
                    />
                </div>
            </main>
        </div>
    );
};

export default TextCanvasApp;
