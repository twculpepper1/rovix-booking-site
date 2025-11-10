import * as React from 'react';
export function Card({ className='', children }: React.PropsWithChildren<{className?:string}>) {
  return <div className={`bg-white rounded-2xl shadow ${className}`}>{children}</div>;
}
export function CardHeader({ className='', children }: React.PropsWithChildren<{className?:string}>) {
  return <div className={`px-5 pt-5 ${className}`}>{children}</div>;
}
export function CardTitle({ className='', children }: React.PropsWithChildren<{className?:string}>) {
  return <h3 className={`font-semibold text-lg ${className}`}>{children}</h3>;
}
export function CardContent({ className='', children }: React.PropsWithChildren<{className?:string}>) {
  return <div className={`px-5 pb-5 ${className}`}>{children}</div>;
}
