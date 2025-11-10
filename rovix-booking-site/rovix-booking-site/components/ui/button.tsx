import * as React from 'react';
type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {variant?: 'primary'|'secondary', size?: 'md'|'lg'};
export function Button({ className='', variant='primary', size='md', ...props }: Props) {
  const base = 'rounded-2xl inline-flex items-center justify-center font-medium transition px-4 py-2';
  const v = variant==='secondary' ? 'bg-slate-100 hover:bg-slate-200' : 'bg-amber-600 hover:bg-amber-700 text-white';
  const s = size==='lg' ? 'text-base px-5 py-3' : 'text-sm';
  return <button className={`${base} ${v} ${s} ${className}`} {...props} />;
}
