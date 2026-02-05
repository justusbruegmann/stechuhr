import styles from './Button.module.css';
import React from 'react'


type Props = {
    type?: 'primary' | 'accent' | 'success' | 'error'; // for extending the options add here
    label: string | React.ReactElement;
    width?: number | string; // number -> rem, string -> raw CSS (e.g. '50%' or '3rem')
    height?: number | string; // number -> rem, string -> raw CSS
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

export default function Button({type = 'primary', label, height, width, onClick}: Props) {
    const variantClass =    type === 'primary' ? styles['button-normal']
         : type === 'accent' ? styles['button-accent']
         : type === 'success' ? styles['button-success']
         : type === 'error' ? styles['button-error']
         : styles['button-normal'];
    // and add the css class here

    const style: React.CSSProperties = {};
    if (width !== undefined) style.width = typeof width === 'number' ? `${width}rem` : width;
    if (height !== undefined) style.height = typeof height === 'number' ? `${height}rem` : height;
    return (
        <div className="button">
            <button className={`${variantClass} ${styles.button}`} style={style} onClick={onClick}>{label}</button>
        </div>
    );
}