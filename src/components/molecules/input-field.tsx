import * as React from "react";
import { Label } from "../atoms/label";
import { Input } from "../atoms/input";
import { cn } from "@/lib/utils";
import { Textarea } from "../atoms/textarea";

type InputProps = React.ComponentProps<typeof Input>;
type TextareaProps = React.ComponentProps<typeof Textarea>;

interface InputFieldProps extends Omit<InputProps, "onChange"> {
    label: string;
    onChange: (value: string) => void;
}

interface AreaFieldProps extends Omit<TextareaProps, "onChange"> {
    label: string;
    onChange: (value: string) => void;
}

const InputField: React.FC<InputFieldProps | AreaFieldProps> = (props) => {
    const { className, id, label, onChange, ...inputProps } = props;

    return (
        <div className={cn("grid h-fit gap-2", className)}>
            <Label htmlFor={id}>{label}</Label>

            {(props as AreaFieldProps).cols ? (
                <Textarea
                    {...(inputProps as AreaFieldProps)}
                    id={id}
                    onChange={(e) => onChange(e.target.value)}
                />
            ) : (
                <Input
                    {...(inputProps as InputFieldProps)}
                    id={id}
                    onChange={(e) => onChange(e.target.value)}
                />
            )}
        </div>
    );
};

export default InputField;
