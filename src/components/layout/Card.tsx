import * as React from 'react';
import styles from './Card.module.css';

interface CardProps {
    children: React.ReactNode;
    width?: number | string;
    height?: number | string;
    backgroundColor?: string;
    shadow?: boolean;
    border?: boolean;
    borderRadius?: number | string;
    borderColor?: string;
    className?: string;
    styleOverrides?: React.CSSProperties;
    onClick?: React.MouseEventHandler<HTMLDivElement>;
    ref?: React.Ref<HTMLDivElement>;
}

export default function Card({
                                 children,
                                 width,
                                 height,
                                 backgroundColor,
                                 shadow = true,
                                 border,
                                 borderRadius,
                                 borderColor,
                                 className,
                                 styleOverrides,
                                 onClick,
                                 ref
                             }: CardProps) {


    const computedStyle: React.CSSProperties = {};
    if (width !== undefined) computedStyle.width = typeof width === 'number' ? `${width}rem` : width;
    if (height !== undefined) computedStyle.height = typeof height === 'number' ? `${height}rem` : height;
    if (backgroundColor !== undefined) computedStyle.backgroundColor = backgroundColor;
    if (shadow) computedStyle.boxShadow = "0 0 10px rgba(0,0,0,0.2)";
    if (border) computedStyle.border = "1px solid black";
    if (borderRadius !== undefined) computedStyle.borderRadius = typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius;
    if (borderColor !== undefined) computedStyle.borderColor = borderColor;

    // Extract CSS rules from className elements and overwrite the Card defaults with these rules
    const classNameStyles: React.CSSProperties = {};
    const classNameList = [styles["card-container"], className].filter(Boolean).join(" ");

    if (typeof document !== 'undefined') {
        const tempEl = document.createElement('div');
        tempEl.className = classNameList;
        document.body.appendChild(tempEl);
        const computedStyles = getComputedStyle(tempEl);

        // Extract relevant CSS properties
        const cssProperties = ['width', 'height', 'backgroundColor', 'boxShadow', 'border', 'borderRadius', 'borderColor'];
        cssProperties.forEach(prop => {
            const value = computedStyles.getPropertyValue(prop);
            if (value) {
                (classNameStyles as any)[prop] = value;
            }
        });

        document.body.removeChild(tempEl);
    }

    const mergedStyle = {...computedStyle, ...classNameStyles, ...styleOverrides}; // computed -> className -> explicit overrides

    return (
        <div className={classNameList} style={mergedStyle} {...(onClick && { onClick })} {...(ref && { ref })}>
            {children}
        </div>
    );
}