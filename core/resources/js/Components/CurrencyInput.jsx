import React, { useRef, useLayoutEffect } from 'react';

export default function CurrencyInput({ value, onChange, className, placeholder = "$0.00", ...props }) {
    const inputRef = useRef(null);
    const cursorRef = useRef(null);

    // Helper to format number string with commas
    const formatNumber = (n) => {
        return n.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    const formatCurrency = (val, blur = false) => {
        let input_val = val;

        if (input_val === "" || input_val === undefined || input_val === null) { return ""; }

        // Ensure input_val is a string
        input_val = String(input_val);

        if (input_val.indexOf(".") >= 0) {
            const decimal_pos = input_val.indexOf(".");
            let left_side = input_val.substring(0, decimal_pos);
            let right_side = input_val.substring(decimal_pos);

            left_side = formatNumber(left_side);
            right_side = formatNumber(right_side);

            if (blur) {
                right_side += "00";
            }

            right_side = right_side.substring(0, 2);
            input_val = "$" + left_side + "." + right_side;
        } else {
            input_val = formatNumber(input_val);
            input_val = "$" + input_val;

            if (blur) {
                input_val += ".00";
            }
        }
        return input_val;
    };

    // Initialize display value if incoming value exists
    const getDisplayValue = (val) => {
        if (!val) return "";
        // Check if it's already formatted
        if (String(val).startsWith('$')) return val;
        // If it's a plain number, format it "on blur" style (full decimals) if needed,
        // or just return as is if we want to respect the raw input?
        // Actually, if we are binding to a cleaned number value, we want to show it formatted.
        return formatCurrency(String(val), true);
    };

    const handleChange = (e) => {
        const input = e.target;
        let input_val = input.value;

        // --- Cursor Management Logic ---
        // 1. Get original length and cursor position
        const original_len = input_val.length;
        const caret_pos = input.selectionStart;

        // 2. Checking for decimal placement
        if (input_val.indexOf(".") >= 0) {
            const decimal_pos = input_val.indexOf(".");
            let left_side = input_val.substring(0, decimal_pos);
            let right_side = input_val.substring(decimal_pos);

            left_side = formatNumber(left_side);
            right_side = formatNumber(right_side);
            right_side = right_side.substring(0, 2);

            input_val = "$" + left_side + "." + right_side;
        } else {
            input_val = formatNumber(input_val);
            input_val = "$" + input_val;
        }

        // 3. Store the desired cursor position
        const updated_len = input_val.length;
        cursorRef.current = updated_len - original_len + caret_pos;

        // 4. Update parent state
        onChange({ target: { value: input_val, name: props.name } });
    };

    const handleBlur = (e) => {
        let val = e.target.value;
        if (val) {
            const formatted = formatCurrency(val, true);
            onChange({ target: { value: formatted, name: props.name } });
        }
        if (props.onBlur) props.onBlur(e);
    };

    // Restore cursor position after render
    useLayoutEffect(() => {
        if (inputRef.current && cursorRef.current !== null) {
            inputRef.current.setSelectionRange(cursorRef.current, cursorRef.current);
            cursorRef.current = null; // Reset after applying
        }
    }, [value]);

    return (
        <input
            {...props}
            ref={inputRef}
            type="text"
            className={className}
            value={getDisplayValue(value)}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={placeholder}
            data-type="currency"
        />
    );
}
