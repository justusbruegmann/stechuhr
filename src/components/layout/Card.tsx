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
    if (width !== undefined) computedStyle.width = typeof width === 'number' ? `${width}rem` : width;
    if (height !== undefined) computedStyle.height = typeof height === 'number' ? `${height}rem` : height;
    if (backgroundColor !== undefined) computedStyle.backgroundColor = backgroundColor;
    if (shadow) computedStyle.boxShadow = "0 0 10px rgba(0,0,0,0.2)";
    if (border) computedStyle.border = "1px solid black";
    if (borderRadius !== undefined) computedStyle.borderRadius = typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius;
    if (borderColor !== undefined) computedStyle.borderColor = borderColor;

    const mergedStyle = {...computedStyle, ...styleOverrides}; // external style overrides computed

    return (
        <div className={styles["card-container"]} style={mergedStyle}>
            {children}
        </div>
    );
}