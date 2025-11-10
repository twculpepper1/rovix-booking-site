import * as React from 'react';
export function Select({ value, onValueChange, children }: {value:string, onValueChange:(v:string)=>void, children: React.ReactNode}) {
  return <select value={value} onChange={(e)=>onValueChange(e.target.value)} className='w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600'>{children}</select>;
}
export function SelectItem({ value, children }:{value:string, children:React.ReactNode}) {
  return <option value={value}>{children}</option>;
}
