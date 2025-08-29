import { Button } from "@/components/atoms/button";
import { useTextConfig } from "@/context/textConfig";
import { AlignCenter, AlignLeft, AlignRight } from "lucide-react";

const AlignmentToggle: React.FC = () => {
    const { alignment, updateConfig } = useTextConfig();

    const handleAlignmentChange = () => {
        updateConfig({
            alignment:
                alignment === "left"
                    ? "center"
                    : alignment === "center"
                      ? "right"
                      : "left",
        });
    };

    return (
        <Button variant="outline" onClick={handleAlignmentChange} size="sm">
            {alignment === "center" ? (
                <AlignCenter />
            ) : alignment === "left" ? (
                <AlignLeft />
            ) : (
                <AlignRight />
            )}
        </Button>
    );
};

export default AlignmentToggle;
