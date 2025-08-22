import { Combobox } from "@/components/molecules/combobox";
import { useTextConfig } from "@/context/textConfig";
import {
    getFontOptions,
    GoogleFontKey,
} from "@/hooks/useGoogleFonts/useGoogleFonts";

interface FontOptionsProps {
    className?: string;
    onFontChange: (value: GoogleFontKey) => void;
}

const FontOptions: React.FC<FontOptionsProps> = (props) => {
    const { className, onFontChange } = props;
    const { updateConfig, ...config } = useTextConfig();

    return (
        <div className={className}>
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
