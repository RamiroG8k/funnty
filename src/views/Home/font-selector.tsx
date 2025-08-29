import { Combobox } from "@/components/molecules/combobox";
import { useTextConfig } from "@/context/textConfig";
import {
    getFontOptions,
    GoogleFontKey,
    useGoogleFonts,
} from "@/hooks/useGoogleFonts";

const FontSelector: React.FC = () => {
    const { updateConfig, ...config } = useTextConfig();
    const { loadFont } = useGoogleFonts();

    return (
        <Combobox
            onChange={(font) => {
                loadFont(font as GoogleFontKey);
                updateConfig({ font });
            }}
            options={getFontOptions()}
            value={config.font}
        />
    );
};

export default FontSelector;
