import {
    createContext,
    PropsWithChildren,
    useContext,
    useState,
    useEffect,
} from "react";
import { TextConfig } from "./types";
import { getConfigFromUrl } from "../textProviderUtils";

interface TextConfigContextProps extends TextConfig {
    updateConfig: (newConfig: Partial<TextConfig>) => void;
}

const TextConfigContext = createContext<TextConfigContextProps>(
    {} as TextConfigContextProps,
);

const defaultTextConfig: TextConfig = {
    text: `Lorem ipsumdolor
sit amet, consectetur adipiscing elit.`,
    font: "Montserrat",
    size: 20,
    weight: "400",
    color: "#000000",
    strokeWidth: 0,
    strokeColor: "#FF0000",
    letterSpacing: 0,
    lineHeight: 1.2,
    alignment: "left",
};

function TextConfigProvider({ children }: PropsWithChildren) {
    const [textConfig, setTextConfig] = useState<TextConfig>(defaultTextConfig);

    useEffect(() => {
        const urlConfig = getConfigFromUrl();
        if (urlConfig) {
            setTextConfig((prevConfig) => ({ ...prevConfig, ...urlConfig }));
        }
    }, []);

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
