'use client';

import * as React from 'react';
import styles from './Button.module.css';

type Props = {
    type?: 'primary' | 'accent' | 'success' | 'error';
    label: React.ReactNode;
    width?: number | string;
    height?: number | string;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    className?: string;
    style?: React.CSSProperties;
    loading?: boolean;
    disabled?: boolean;
};

export default function Button({
                                   type = 'primary',
                                   label,
                                   height,
                                   width,
                                   onClick,
                                   className,
                                   style,
                                   loading,
                                   disabled
                               }: Props) {
    const variantClass =
        type === 'primary' ? styles['button-normal']
            : type === 'accent' ? styles['button-accent']
                : type === 'success' ? styles['button-success']
                    : styles['button-error'];

    const computedStyle: React.CSSProperties = {};
    if (width !== undefined) computedStyle.width = typeof width === 'number' ? `${width}rem` : width;
    if (height !== undefined) computedStyle.height = typeof height === 'number' ? `${height}rem` : height;

    const mergedStyle = {...computedStyle, ...style}; // external style overrides computed
    const mergedClassName = `${styles.button} ${variantClass} ${className ?? ''}`.trim();

    // @ts-ignore
    return (
        <div className={styles.wrapper} style={mergedStyle}>
            <button className={mergedClassName} style={{height: '100%', width: '100%'}} onClick={onClick} disabled={disabled || loading}>
                {loading ? <span className={styles.spinner} /> : label}
            </button>
        </div>
    );
}