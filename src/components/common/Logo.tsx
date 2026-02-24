import React from 'react';

interface LogoProps {
    className?: string;
    size?: number;
}

export const Logo: React.FC<LogoProps> = ({ className, size = 32 }) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <path
                d="M 15 40 A 38 38 0 0 0 85 30"
                stroke="#39ce86"
                strokeWidth="22"
                strokeLinecap="butt"
            />
        </svg>
    );
};
