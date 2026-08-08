export interface DropdownProps<T> {

    items: T[];

    value?: T;

    placeholder?: string;

    disabled?: boolean;

    className?: string;

    width?: number | string;

    getValue: (item: T) => string;

    getLabel: (item: T) => string;

    onChange: (item: T) => void;

}