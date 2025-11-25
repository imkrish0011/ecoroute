import React from 'react';
import { Info } from 'lucide-react';

const EcoScoreBreakdown = ({ breakdown }) => {
    if (!breakdown) return null;

    const { distancePenalty, elevationPenalty, turnsPenalty, baseScore } = breakdown;

    return (
        <div className="bg-[#252525] p-4 rounded-lg border border-[#333] mt-4">
            <div className="flex items-center gap-2 mb-3 text-gray-300 text-sm font-semibold">
                <Info size={16} className="text-blue-400" />
                Why this score?
            </div>

            <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                    <span className="text-gray-400">Base Score</span>
                    <span className="text-green-500 font-mono">+{baseScore}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-gray-400">Distance Impact</span>
                    <span className="text-red-400 font-mono">-{distancePenalty}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-gray-400">Elevation Impact</span>
                    <span className="text-red-400 font-mono">-{elevationPenalty}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-gray-400">Turns/Complexity</span>
                    <span className="text-red-400 font-mono">-{turnsPenalty}</span>
                </div>

                <div className="h-px bg-[#333] my-2"></div>

                <div className="flex justify-between items-center font-bold">
                    <span className="text-white">Final EcoScore</span>
                    <span className="text-white font-mono">{Math.max(0, baseScore - distancePenalty - elevationPenalty - turnsPenalty).toFixed(0)}</span>
                </div>
            </div>
        </div>
    );
};

export default EcoScoreBreakdown;
