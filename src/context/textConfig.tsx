import { createContext, PropsWithChildren, useContext, useState } from "react";

export interface TextConfig {
    text: string;
    font: string;
    size: number;
    weight:
        | "100"
        | "200"
        | "300"
        | "400"
        | "500"
        | "600"
        | "700"
        | "800"
        | "900";
    color: string;
    strokeWidth: number;
    strokeColor: string;
    letterSpacing: number;
    lineHeight: number;
    padding: number;
    scale: number;
    rotation: number;
    alignment: "left" | "center" | "right";
    maxWidth: number;
}

interface TextConfigContextProps extends TextConfig {
    updateConfig: (newConfig: Partial<TextConfig>) => void;
}

const TextConfigContext = createContext<TextConfigContextProps>(
    {} as TextConfigContextProps,
);

function TextConfigProvider({ children }: PropsWithChildren) {
    const [textConfig, setTextConfig] = useState<TextConfig>({
        text: "Salio el soool >..<",
        font: "Arial",
        size: 24,
        weight: "400",
        color: "#000000",
        strokeWidth: 0,
        strokeColor: "#000000",
        letterSpacing: 0,
        lineHeight: 1.2,
        padding: 0,
        scale: 1,
        rotation: 0,
        alignment: "left",
        maxWidth: 0,
    });

    const value = {
        ...textConfig,
        updateConfig: (newConfig: Partial<TextConfig>) => {
            setTextConfig((prevConfig) => ({ ...prevConfig, ...newConfig }));
        },
    };

    return (
        <TextConfigContext.Provider value={value}>
            {children}
        </TextConfigContext.Provider>
    );
}

function useTextConfig() {
    const context = useContext(TextConfigContext);

    if (!context) {
        throw new Error(
            "useTextConfig must be used within a TextConfigProvider",
        );
    }

    return context;
}

export { useTextConfig, TextConfigProvider };
