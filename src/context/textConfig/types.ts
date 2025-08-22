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
    alignment: "left" | "center" | "right";
}
