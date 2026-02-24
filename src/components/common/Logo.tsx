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
            <g transform="rotate(-90 50 50)">
                {/* White part of the logo */}
                <circle cx="50" cy="50" r="35" stroke="#ffffff" strokeWidth="22" strokeDasharray="55 165" strokeDashoffset="0" />
                {/* Green part of the logo */}
                <circle cx="50" cy="50" r="35" stroke="#39ce86" strokeWidth="22" strokeDasharray="110 110" strokeDashoffset="-55" />
            </g>
        </svg>
    );
};
