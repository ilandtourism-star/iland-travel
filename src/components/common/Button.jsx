import React from 'react';

const Button = ({
    children,
    onClick,
    variant = 'primary',
    size = 'md',
    className = '',
    disabled = false,
    ...props
}) => {
    const baseStyle = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '8px',
        fontWeight: '600',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s ease',
        border: 'none',
        opacity: disabled ? 0.6 : 1,
        fontFamily: 'inherit',
    };

    const variants = {
        primary: {
            backgroundColor: '#5392f9',
            color: 'white',
        },
        secondary: {
            backgroundColor: '#f1f5f9',
            color: '#475569',
            border: '1px solid #e2e8f0',
        },
        outline: {
            backgroundColor: 'transparent',
            color: '#5392f9',
            border: '1px solid #5392f9',
        },
        danger: {
            backgroundColor: '#ef4444',
            color: 'white',
        }
    };

    const sizes = {
        sm: {
            padding: '6px 12px',
            fontSize: '0.85rem',
        },
        md: {
            padding: '10px 20px',
            fontSize: '0.95rem',
        },
        lg: {
            padding: '12px 24px',
            fontSize: '1.1rem',
        }
    };

    const combinedStyle = {
        ...baseStyle,
        ...variants[variant],
        ...sizes[size],
    };

    return (
        <button
            style={combinedStyle}
            onClick={onClick}
            disabled={disabled}
            className={`btn-${variant} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
