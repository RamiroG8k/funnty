import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "../atoms/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "../atoms/command";
import { Popover, PopoverContent, PopoverTrigger } from "../atoms/popover";
import { useState } from "react";

interface ComboboxProps {
    options: Array<{
        label: string;
        value: string;
    }>;
    onChange: (value: string) => void;
    value: string;
    defaultValue?: string;
}

export function Combobox(props: ComboboxProps) {
    const { options, onChange, value } = props;

    const [open, setOpen] = useState(false);

    const handleChange = (value: string) => {
        onChange(value);
        setOpen(false);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-fit justify-between"
                    size="sm"
                >
                    {value ?? "Select font..."}
                    <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-fit p-0">
                <Command>
                    <CommandInput placeholder="Search option..." />
                    <CommandList>
                        <CommandEmpty>No framework found.</CommandEmpty>
                        <CommandGroup>
                            {options?.map((option) => (
                                <CommandItem
                                    key={option.value}
                                    value={option.value}
                                    onSelect={handleChange}
                                >
                                    <CheckIcon
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === option.value
                                                ? "opacity-100"
                                                : "opacity-0",
                                        )}
                                    />
                                    {option.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
