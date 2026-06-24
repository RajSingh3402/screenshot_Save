import React from 'react';

export const S = {
  input: {
    width: "100%",
    background: "#0f1117",
    border: "1px solid #1e2130",
    borderRadius: 8,
    padding: "9px 12px",
    color: "#e2e8f0",
    fontSize: 13,
    outline: "none",
    fontFamily: "inherit"
  } as React.CSSProperties,
  
  btn: (bg: string, color: string, extra: React.CSSProperties = {}) => ({
    background: bg,
    color,
    border: "none",
    borderRadius: 8,
    padding: "8px 16px",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "all 0.2s",
    ...extra
  } as React.CSSProperties),
  
  card: { 
    background: "#13151f", 
    border: "1px solid #1e2130", 
    borderRadius: 12 
  } as React.CSSProperties,
  
  th: {
    padding: "11px 16px",
    textAlign: "left" as const,
    fontSize: 11,
    color: "#64748b",
    fontWeight: 500,
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
    whiteSpace: "nowrap"
  } as React.CSSProperties,
  
  td: (extra: React.CSSProperties = {}) => ({ 
    padding: "12px 16px", 
    fontSize: 13, 
    ...extra 
  } as React.CSSProperties),
};

export const badge = (bg: string, color: string, text: string) => (
  React.createElement('span', {
    style: {
      fontSize: 11,
      padding: "3px 10px",
      borderRadius: 20,
      background: bg,
      color,
      fontWeight: 500
    }
  }, text)
);
