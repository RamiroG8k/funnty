import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/atoms/select";
import { Combobox } from "@/components/molecules/combobox";
import { TextConfig, useTextConfig } from "@/context/textConfig";

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

const FONT_WEIGHTS = {
    Thin: "100",
    ExtraLight: "200",
    Light: "300",
    Regular: "400",
    Medium: "500",
    SemiBold: "600",
    Bold: "700",
    ExtraBold: "800",
    Black: "900",
} as const;

interface FontOptionsProps {
    onFontChange: (value: string) => void;
}

const FontOptions: React.FC<FontOptionsProps> = ({ onFontChange }) => {
    const { updateConfig, ...config } = useTextConfig();

    return (
        <div className="flex gap-2 absolute top-3">
            <Combobox
                onChange={(value) => {
                    onFontChange(value);
                    updateConfig({ font: value });
                }}
                options={POPULAR_FONTS.map((item) => ({
                    label: item,
                    value: item,
                }))}
                value={config.font}
            />

            <Select
                value={config.weight}
                onValueChange={(weight: TextConfig["weight"]) =>
                    updateConfig({ weight })
                }
            >
                <SelectTrigger className="w-fit bg-background" size="sm">
                    <SelectValue placeholder="Weight" />
                </SelectTrigger>
                <SelectContent>
                    {Object.entries(FONT_WEIGHTS).map(([weight, value]) => (
                        <SelectItem
                            key={weight}
                            value={value}
                            style={{
                                fontWeight: value,
                            }}
                        >
                            {weight}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};

export default FontOptions;
