import { useState } from 'react';

const SIZE_CHART = [
    { size: 'XS', chest: '34-36', waist: '28-30', hips: '35-37' },
    { size: 'S', chest: '36-38', waist: '30-32', hips: '37-39' },
    { size: 'M', chest: '38-40', waist: '32-34', hips: '39-41' },
    { size: 'L', chest: '40-42', waist: '34-36', hips: '41-43' },
    { size: 'XL', chest: '42-44', waist: '36-38', hips: '43-45' },
    { size: 'XXL', chest: '44-46', waist: '38-40', hips: '45-47' },
];

export default function SizeGuide({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-black text-slate-950">Size Guide</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-slate-600 transition-all duration-200 hover:bg-slate-200 active:scale-95"
                    >
                        ✕
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b-2 border-slate-200">
                                <th className="py-3 text-left font-black text-slate-950">Size</th>
                                <th className="py-3 text-left font-black text-slate-950">Chest (in)</th>
                                <th className="py-3 text-left font-black text-slate-950">Waist (in)</th>
                                <th className="py-3 text-left font-black text-slate-950">Hips (in)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {SIZE_CHART.map((row, index) => (
                                <tr key={index} className="border-b border-slate-100">
                                    <td className="py-3 font-black text-orange-600">{row.size}</td>
                                    <td className="py-3 font-semibold text-slate-700">{row.chest}</td>
                                    <td className="py-3 font-semibold text-slate-700">{row.waist}</td>
                                    <td className="py-3 font-semibold text-slate-700">{row.hips}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-4 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 p-4 ring-1 ring-orange-200">
                    <p className="text-xs font-bold text-orange-700 mb-2">💡 How to measure:</p>
                    <ul className="space-y-1 text-xs font-semibold text-slate-600">
                        <li>• <strong>Chest:</strong> Measure around the fullest part</li>
                        <li>• <strong>Waist:</strong> Measure around natural waistline</li>
                        <li>• <strong>Hips:</strong> Measure around the fullest part</li>
                    </ul>
                </div>

                <button
                    type="button"
                    onClick={onClose}
                    className="mt-4 w-full rounded-2xl bg-orange-600 px-4 py-3 text-sm font-black text-white transition-all duration-200 hover:bg-orange-700 active:scale-95"
                >
                    Close
                </button>
            </div>
        </div>
    );
}
