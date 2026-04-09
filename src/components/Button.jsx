import React from 'react';

export default function Button({
  children,
  variant = 'primary',
  className = '',
  disabled = false,
  type = 'button',
  ...props
}) {
  const baseStyle = "inline-flex items-center justify-center gap-2 font-medium rounded transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";

  // Füge Standard-Padding nur ein, wenn kein eigenes via className übergeben wird
  const padding = className.includes('p-') || className.includes('px-') || className.includes('py-') ? '' : 'px-4 py-2';

  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-sm",
    success: "bg-green-600 hover:bg-green-700 active:bg-green-800 text-white shadow-sm",
    secondary: "text-gray-700 hover:bg-gray-300 active:bg-gray-300",
    outline: "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 active:bg-gray-100 shadow-sm",
    danger: "bg-red-600 text-white hover:bg-red-800 active:bg-red-200 hover:text-white",
    dark: "bg-gray-800 hover:bg-gray-900 active:bg-black text-white shadow-sm"
  };

  return (
    <button
      type={type}
      disabled={disabled}
      className={`${baseStyle} ${padding} ${variants[variant] || variants.primary} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}

