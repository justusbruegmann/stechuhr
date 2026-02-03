import styles from './Button.module.css';

type Props = {
    type?: 'primary' | 'accent';
    label: string;
    width?: number | string; // number -> rem, string -> raw CSS (e.g. '50%' or '3rem')
    height?: number | string; // number -> rem, string -> raw CSS
};

export default function Button({type = 'primary', label, height, width}: Props) {
    const variantClass =    type === 'primary' ? styles['button-normal']
         : type === 'accent' ? styles['button-accent']
         : type === 'success' ? styles['button-success']
         : styles['button-error'];

    const style: React.CSSProperties = {};
    if (width !== undefined) style.width = typeof width === 'number' ? `${width}rem` : width;
    if (height !== undefined) style.height = typeof height === 'number' ? `${height}rem` : height;
    return (
        <div className="button">
            <button className={`${variantClass} ${styles.button}`} style={style}
                    onClick={() => console.log("Test")}>{label}</button>
        </div>
    );
}