import { TextConfig } from "./textConfig";

export function getConfigFromUrl(): Partial<TextConfig> | null {
    const params = new URLSearchParams(window.location.search);
    const config: Partial<TextConfig> = {};
    let hasParams = false;

    for (const [key, value] of params) {
        hasParams = true;
        switch (key) {
            case "size":
            case "strokeWidth":
            case "letterSpacing":
            case "lineHeight":
                config[key] = parseFloat(value);
                break;
            case "weight":
                if (
                    [
                        "100",
                        "200",
                        "300",
                        "400",
                        "500",
                        "600",
                        "700",
                        "800",
                        "900",
                    ].includes(value)
                ) {
                    config[key] = value as TextConfig["weight"];
                }
                break;
            case "alignment":
                if (["left", "center", "right"].includes(value)) {
                    config[key] = value as TextConfig["alignment"];
                }
                break;
            case "text":
            case "font":
            case "color":
            case "strokeColor":
                config[key] = decodeURIComponent(value);
                break;
        }
    }

    return hasParams ? config : null;
}
