import styles from './Button.module.css';

type Props = {
    type?: 'primary' | 'accent';
    label: string;
};

export default function Button({type = 'primary', label}: Props) {
    const className = type === 'primary' ? styles['button-normal'] : styles['button-accent'];
    return (
        <div className="button">
            <button className={`${className}`}>{label}</button>
        </div>
    );
}