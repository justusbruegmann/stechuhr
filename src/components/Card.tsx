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
    styleOverrides?: React.CSSProperties;
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
                                 styleOverrides
                             }: CardProps) {


    const computedStyle: React.CSSProperties = {};
    if (width) computedStyle.width = typeof width === 'number' ? `${width}rem` : width;
    if (height) computedStyle.height = typeof height === 'number' ? `${height}rem` : height;
    if (backgroundColor) computedStyle.backgroundColor = backgroundColor;
    if (shadow) computedStyle.boxShadow = "0 0 10px rgba(0,0,0,0.2)";
    if (border) computedStyle.border = "1px solid black";
    if (borderRadius) computedStyle.borderRadius = typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius;
    if (borderColor) computedStyle.borderColor = borderColor;

    const mergedStyle = {...computedStyle, ...styleOverrides}; // external style overrides computed

    return (
        <div className={styles["card-container"]} style={mergedStyle}>
            {children}
        </div>
    );
}