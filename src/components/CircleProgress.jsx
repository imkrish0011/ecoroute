import React from 'react';

const CircleProgress = ({ score, size = 60, strokeWidth = 4 }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (score / 100) * circumference;

    const getColor = (s) => {
        if (s >= 80) return '#22c55e'; // green-500
        if (s >= 50) return '#eab308'; // yellow-500
        return '#ef4444'; // red-500
    };

    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            <svg className="transform -rotate-90 w-full h-full">
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="#333"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={getColor(score)}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-white font-bold text-sm">{Math.round(score)}</span>
            </div>
        </div>
    );
};

export default CircleProgress;
