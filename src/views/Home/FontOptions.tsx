import { Combobox } from "@/components/molecules/combobox";
import { useTextConfig } from "@/context/textConfig";
import {
    getFontOptions,
    GoogleFontKey,
} from "@/hooks/useGoogleFonts/useGoogleFonts";

interface FontOptionsProps {
    onFontChange: (value: GoogleFontKey) => void;
}

const FontOptions: React.FC<FontOptionsProps> = ({ onFontChange }) => {
    const { updateConfig, ...config } = useTextConfig();

    return (
        <div className="flex gap-2 absolute top-3">
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
