
import React from 'react';
import { COLOR_OPTIONS } from '../constants';

interface ColorPaletteProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
}

export const ColorPalette: React.FC<ColorPaletteProps> = ({ selectedColor, onColorChange }) => {
  return (
    <div className="grid grid-cols-5 gap-3">
      {COLOR_OPTIONS.map((color) => (
        <button
          key={color}
          onClick={() => onColorChange(color)}
          className={`w-full aspect-square rounded-full cursor-pointer transition-transform duration-200 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-400 ${
            selectedColor === color ? 'ring-2 ring-offset-2 ring-offset-gray-800 ring-cyan-400' : 'ring-1 ring-gray-600'
          }`}
          style={{ backgroundColor: color }}
          aria-label={`Select color ${color}`}
        />
      ))}
    </div>
  );
};
