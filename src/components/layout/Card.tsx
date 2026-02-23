'use client';

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
}

export default React.forwardRef<HTMLDivElement, CardProps>(function Card({
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
}: CardProps, ref) {
    // Inline styles handle dynamic/prop-based values and have highest specificity
    const inlineStyle: React.CSSProperties = {};

    if (width !== undefined) inlineStyle.width = typeof width === 'number' ? `${width}rem` : width;
    if (height !== undefined) inlineStyle.height = typeof height === 'number' ? `${height}rem` : height;
    if (backgroundColor !== undefined) inlineStyle.backgroundColor = backgroundColor;
    if (shadow) inlineStyle.boxShadow = "0 0 10px rgba(0,0,0,0.2)";
    if (border) inlineStyle.border = "1px solid black";
    if (borderRadius !== undefined) inlineStyle.borderRadius = typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius;
    if (borderColor !== undefined) inlineStyle.borderColor = borderColor;

    // Merge styles with styleOverrides having the highest priority
    const finalStyle = { ...inlineStyle, ...styleOverrides };

    // Combine card base styles with external classNames (external classes have higher specificity through CSS cascade)
    const classNameList = [styles["card-container"], className].filter(Boolean).join(" ");

    return (
        <div
            className={classNameList}
            style={finalStyle}
            onClick={onClick}
            ref={ref}
        >
            {children}
        </div>
    );
});