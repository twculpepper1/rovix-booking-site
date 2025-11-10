'use client';
import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Truck, ShieldCheck, Calendar as CalIcon, Mail, Phone, MapPin, Image as ImageIcon, SendHorizonal, Calculator as CalcIcon, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectItem } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

const RATES = {
  nightly: 150,
  prep: 100,
  deliveryPerMileOneWay: 5,
  deliveryMinimum: 250,
  generatorPerNight: 50,
  towels: 50,
  linens: 75,
  dump: 100,
  cleaning: 150,
  securityDepositHold: 1000,
  packages: { weekendPickup: 425, weekendDelivery40: 650, sundayToSundayPickup: 950 },
} as const;

const UNIT = {
  id: 'Puma-31QBBH',
  title: '2025 Palomino Puma 31QBBH',
  sleeps: 7,
  features: ['3 A/C units','Electric fireplace','Amazing outdoor kitchen','Indoor/Outdoor speakers','Smart TV','Private front bedroom','Private bunk room'],
};

function currency(n:number) { return n.toLocaleString(undefined, { style: 'currency', currency: 'USD' }); }
function Section({ id, title, subtitle, children }:{id:string, title:string, subtitle?:string, children:React.ReactNode}) {
  return (<section id={id} className="container py-12"><motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}><h2 className="text-3xl md:text-4xl font-bold tracking-tight">{title}</h2>{subtitle && <p className="text-slate-600 mt-2 max-w-3xl">{subtitle}</p>}<div className="mt-8">{children}</div></motion.div></section>);
}

type State = { nights:any; package:any; pickupOrDelivery:any; miles:any; generator:boolean; towels:boolean; linens:boolean; dump:boolean; chairsQty:any; cornholeQty:any; overrideNightly:string; overridePrep:string; discount:any; taxRate:any; cleaning:boolean; name:string; email:string; phone:string; notes:string; checkin:string; checkout:string; location:string; };
function useBookingCalculator(state: State) {
  return useMemo(() => {
    const nights = Number(state.nights || 0);
    const miles = Number(state.miles || 0);
    const chairsQty = Number(state.chairsQty || 0);
    const cornholeQty = Number(state.cornholeQty || 0);
    const genNights = state.generator ? nights : 0;
    const nightlySubtotal = state.package !== 'none' ? 0 : nights * (state.overrideNightly ? Number(state.overrideNightly) : RATES.nightly);
    let packageSubtotal = 0;
    if (state.package === 'weekendPickup') packageSubtotal = RATES.packages.weekendPickup;
    if (state.package === 'weekendDelivery40') packageSubtotal = RATES.packages.weekendDelivery40;
    if (state.package === 'sundayToSundayPickup') packageSubtotal = RATES.packages.sundayToSundayPickup;
    let delivery = 0;
    const deliveryIncluded = state.package === 'weekendDelivery40';
    if (!deliveryIncluded) { const perMile = miles * RATES.deliveryPerMileOneWay; delivery = Math.max(RATES.deliveryMinimum, perMile); if (state.pickupOrDelivery === 'pickup') delivery = 0; }
    const addons = genNights * RATES.generatorPerNight + (state.towels ? RATES.towels : 0) + (state.linens ? RATES.linens : 0) + (state.dump ? RATES.dump : 0) + chairsQty * 7 + cornholeQty * 30;
    const prep = state.package !== 'none' ? 0 : (state.overridePrep ? Number(state.overridePrep) : RATES.prep);
    const cleaning = state.cleaning ? RATES.cleaning : 0;
    const discount = Number(state.discount || 0);
    const subtotal = nightlySubtotal + packageSubtotal + delivery + addons + prep + cleaning - discount;
    const taxRate = Number(state.taxRate || 0) / 100;
    const tax = Math.round(subtotal * taxRate * 100) / 100;
    const total = Math.round((subtotal + tax) * 100) / 100;
    return { nightlySubtotal, packageSubtotal, delivery, addons, prep, cleaning, discount, subtotal, tax, total, securityDepositHold: RATES.securityDepositHold };
  }, [state]);
}

function BookingCalculator() {
  const [state, setState] = useState<State>({ nights: 2, package: 'none', pickupOrDelivery: 'delivery', miles: 30, generator: true, towels: true, linens: true, dump: false, chairsQty: 0, cornholeQty: 0, overrideNightly: '', overridePrep: '', discount: 0, taxRate: 0, cleaning: false, name: '', email: '', phone: '', notes: '', checkin: '', checkout: '', location: 'La Porte, TX' });
  const calc = useBookingCalculator(state);
  const update = (k:any, v:any)=> setState(s=>({...s, [k]: v}));
  const mailtoHref = ()=>{
    const subject = encodeURIComponent(`Booking Request — Rovix (${state.checkin || 'TBD'} → ${state.checkout || 'TBD'})`);
    const lines = [
      `Name: ${state.name}`,
      `Phone: ${state.phone}`,
      `Email: ${state.email}`,
      `Check-in: ${state.checkin}`,
      `Check-out: ${state.checkout}`,
      `Nights: ${state.nights}`,
      `Pickup/Delivery: ${state.pickupOrDelivery}${state.pickupOrDelivery === 'delivery' ? `, Miles (one-way): ${state.miles}` : ''}`,
      `Package: ${state.package}`,
      `Add-ons: generator=${state.generator}, towels=${state.towels}, linens=${state.linens}, dump=${state.dump}, chairs=${state.chairsQty}, cornhole=${state.cornholeQty}`,
      `Location: ${state.location}`,
      `Notes: ${state.notes}`,
      `---`,
      `Estimate: ${calc.total.toLocaleString(undefined,{style:'currency',currency:'USD'})} (Tax: ${calc.tax.toLocaleString(undefined,{style:'currency',currency:'USD'})})`,
      `Security Deposit (hold): ${(RATES.securityDepositHold).toLocaleString(undefined,{style:'currency',currency:'USD'})}`,
    ].join('%0D%0A');
    return `mailto:tyler@towawaycamping.co?subject=${subject}&body=${lines}`;
  };
  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card><CardHeader><CardTitle className="flex items-center gap-2 text-2xl"><CalcIcon className="w-6 h-6"/> Build Your Trip</CardTitle></CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div><Label>Nights</Label><Input type="number" min={1} value={state.nights} onChange={(e:any)=>update('nights', Number(e.target.value))} /></div>
          <div><Label>Pickup or Delivery</Label><Select value={state.pickupOrDelivery} onValueChange={(v:any)=>update('pickupOrDelivery', v)}><SelectItem value="pickup">Pickup</SelectItem><SelectItem value="delivery">Delivery</SelectItem></Select></div>
          {state.pickupOrDelivery === 'delivery' && (<div><Label>Miles (one-way)</Label><Input type="number" min={0} value={state.miles} onChange={(e:any)=>update('miles', Number(e.target.value))} /><p className="text-xs text-slate-500 mt-1">$5/mi, $250 minimum</p></div>)}
          <div className="md:col-span-3"><Label>Package (optional)</Label><Select value={state.package} onValueChange={(v:any)=>update('package', v)}>
            <SelectItem value="none">None (use nightly)</SelectItem>
            <SelectItem value="weekendPickup">Weekend Pickup — $425.00</SelectItem>
            <SelectItem value="weekendDelivery40">Weekend Delivery ≤40mi — $650.00</SelectItem>
            <SelectItem value="sundayToSundayPickup">Sunday–Sunday Pickup — $950.00</SelectItem>
          </Select></div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Add‑ons</Label>
            <div className="flex items-center gap-2"><Checkbox checked={state.generator} onCheckedChange={(v:boolean)=>update('generator', v)} /> <span>Generator ($50/night)</span></div>
            <div className="flex items-center gap-2"><Checkbox checked={state.towels} onCheckedChange={(v:boolean)=>update('towels', v)} /> <span>Towels ($50)</span></div>
            <div className="flex items-center gap-2"><Checkbox checked={state.linens} onCheckedChange={(v:boolean)=>update('linens', v)} /> <span>Linens ($75)</span></div>
            <div className="flex items-center gap-2"><Checkbox checked={state.dump} onCheckedChange={(v:boolean)=>update('dump', v)} /> <span>Dump service ($100)</span></div>
            <div className="flex items-center gap-2"><Checkbox checked={state.cleaning} onCheckedChange={(v:boolean)=>update('cleaning', v)} /> <span>Pre-add cleaning safeguard ($150)</span></div>
          </div>
          <div className="space-y-2">
            <Label>Quantities</Label>
            <div><Label className="text-xs">Lawn chairs (0–6) — $7 each</Label><Input type="number" min={0} max={6} value={state.chairsQty} onChange={(e:any)=>update('chairsQty', Number(e.target.value))} /></div>
            <div><Label className="text-xs">Cornhole/Washer boards — $30 each</Label><Input type="number" min={0} value={state.cornholeQty} onChange={(e:any)=>update('cornholeQty', Number(e.target.value))} /></div>
          </div>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <div><Label>Override nightly (optional)</Label><Input placeholder="150" value={state.overrideNightly} onChange={(e:any)=>update('overrideNightly', e.target.value)} /></div>
          <div><Label>Override prep (optional)</Label><Input placeholder="100" value={state.overridePrep} onChange={(e:any)=>update('overridePrep', e.target.value)} /></div>
          <div><Label>Discount $</Label><Input type="number" min={0} value={state.discount} onChange={(e:any)=>update('discount', Number(e.target.value))} /></div>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <div><Label>Tax rate %</Label><Input type="number" min={0} step="0.25" value={state.taxRate} onChange={(e:any)=>update('taxRate', Number(e.target.value))} /></div>
          <div><Label><CalIcon className="inline w-4 h-4 mr-1"/> Check‑in</Label><Input type="date" value={state.checkin} onChange={(e:any)=>update('checkin', e.target.value)} /></div>
          <div><Label><CalIcon className="inline w-4 h-4 mr-1"/> Check‑out</Label><Input type="date" value={state.checkout} onChange={(e:any)=>update('checkout', e.target.value)} /></div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><Label><MapPin className="inline w-4 h-4 mr-1"/> Location</Label><Input placeholder="Delivery city / campground" value={state.location} onChange={(e:any)=>update('location', e.target.value)} /></div>
          <div><Label><Phone className="inline w-4 h-4 mr-1"/> Phone</Label><Input placeholder="832-577-9523" value={state.phone} onChange={(e:any)=>update('phone', e.target.value)} /></div>
          <div><Label><Mail className="inline w-4 h-4 mr-1"/> Email</Label><Input placeholder="you@example.com" value={state.email} onChange={(e:any)=>update('email', e.target.value)} /></div>
          <div><Label>Name</Label><Input placeholder="Your full name" value={state.name} onChange={(e:any)=>update('name', e.target.value)} /></div>
        </div>
        <div><Label>Notes</Label><Textarea rows={3} value={state.notes} onChange={(e:any)=>update('notes', e.target.value)} placeholder="Anything we should know?" /></div>
      </CardContent></Card>
      <Card><CardHeader><CardTitle className="flex items-center gap-2 text-2xl"><DollarSign className="w-6 h-6"/> Transparent Pricing</CardTitle></CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="grid grid-cols-2 gap-y-1">
            <div>Nightly subtotal</div><div className="text-right font-medium">${'{'}(Number(calc.nightlySubtotal)).toFixed(2){'}'}</div>
            <div>Package subtotal</div><div className="text-right font-medium">${'{'}(Number(calc.packageSubtotal)).toFixed(2){'}'}</div>
            <div className="flex items-center gap-1">Delivery { '{'}state.pickupOrDelivery==='pickup' && <span className="text-slate-500">(pickup)</span>{'}'}</div><div className="text-right font-medium">${'{'}(Number(calc.delivery)).toFixed(2){'}'}</div>
            <div>Add‑ons</div><div className="text-right font-medium">${'{'}(Number(calc.addons)).toFixed(2){'}'}</div>
            <div>Prep</div><div className="text-right font-medium">${'{'}(Number(calc.prep)).toFixed(2){'}'}</div>
            <div>Cleaning</div><div className="text-right font-medium">${'{'}(Number(calc.cleaning)).toFixed(2){'}'}</div>
            <div>Discount</div><div className="text-right font-medium">- ${'{'}(Number(calc.discount)).toFixed(2){'}'}</div>
            <div className="border-t col-span-2 my-2"></div>
            <div>Subtotal</div><div className="text-right font-semibold">${'{'}(Number(calc.subtotal)).toFixed(2){'}'}</div>
            <div>Tax</div><div className="text-right font-medium">${'{'}(Number(calc.tax)).toFixed(2){'}'}</div>
            <div className="text-lg font-bold">Trip Total</div><div className="text-right text-lg font-bold">${'{'}(Number(calc.total)).toFixed(2){'}'}</div>
            <div className="col-span-2 text-xs text-slate-500 mt-2">A refundable/creditable security deposit hold of $1,000.00 applies at checkout.</div>
          </div>
          <div className="flex gap-3 pt-4">
            <a href={ '{'}mailtoHref(){'}' }><Button className="rounded-2xl"><SendHorizonal className="mr-2 w-5 h-5"/>Send Request</Button></a>
            <Button className="rounded-2xl" onClick={() => alert('In production, this would open a Stripe Payment Link for the deposit.')}>Pay Deposit</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <header className="sticky top-0 z-40 backdrop-blur bg-white/70 border-b">
        <div className="container h-16 flex items-center justify-between">
          <a href="#" className="font-extrabold text-xl tracking-tight">Rovix <span className="text-amber-600">— Adventure Delivered</span></a>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#booking" className="hover:text-amber-700">Book</a>
            <a href="#unit" className="hover:text-amber-700">The Camper</a>
            <a href="#how" className="hover:text-amber-700">How it Works</a>
            <a href="#faq" className="hover:text-amber-700">FAQ</a>
            <a href="#contact" className="hover:text-amber-700">Contact</a>
          </nav>
          <a href="#booking" className="hidden md:inline-flex"><Button className="rounded-2xl">Get Started</Button></a>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="container py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <motion.h1 initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} transition={{duration:.5}} className="text-4xl md:text-5xl font-extrabold tracking-tight">Adventure <span className="text-amber-600">Delivered</span>.</motion.h1>
              <p className="mt-4 text-lg text-slate-600 max-w-prose">We deliver and set up a fully‑stocked 2025 Palomino Puma so you can focus on good times. Transparent pricing, flexible packages, and concierge support from a family‑run Texas business.</p>
              <div className="mt-6 flex gap-3">
                <a href="#booking"><Button className="rounded-2xl">Get a Quote</Button></a>
                <a href="#unit"><Button className="rounded-2xl" variant="secondary">See the Camper</Button></a>
              </div>
              <div className="flex gap-6 mt-6 text-sm">
                <div className="flex items-center gap-2"><Truck className="w-4 h-4"/> Delivery within Greater Houston</div>
                <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4"/> $1,000 deposit hold</div>
              </div>
            </div>
            <motion.div initial={{opacity:0, scale:.98}} animate={{opacity:1, scale:1}} transition={{duration:.5}} className="aspect-[4/3] rounded-2xl bg-amber-100/40 border grid place-items-center">
              <ImageIcon className="w-16 h-16 text-amber-700"/>
            </motion.div>
          </div>
        </div>
      </section>

      <Section id="booking" title="Book Your Getaway" subtitle="Choose pickup or delivery, add options, and see your total in real time.">
        <BookingCalculator />
      </Section>

      <Section id="unit" title={UNIT.title} subtitle={`Sleeps ${'{'}UNIT.sleeps{'}'} • Private bedroom + bunk room • Outdoor kitchen`}>
        <div className="grid md:grid-cols-3 gap-6">
          <Card><CardContent className="p-0"><div className="aspect-[16/9] w-full rounded-2xl bg-slate-100 grid place-items-center"><ImageIcon className="w-12 h-12 text-amber-700"/></div></CardContent></Card>
          <Card><CardHeader><CardTitle>Highlights</CardTitle></CardHeader><CardContent><ul className="space-y-2 list-disc pl-5">{'{'}UNIT.features.map(f=>(<li key={f}>{'{'}f{'}'}</li>)){'}'}</ul></CardContent></Card>
          <Card><CardHeader><CardTitle>Service Area</CardTitle></CardHeader><CardContent>Greater Houston • La Porte • Trinity, TX</CardContent></Card>
        </div>
      </Section>

      <Section id="how" title="How It Works" subtitle="Simple, clear, and fast.">
        <div className="grid md:grid-cols-3 gap-6">
          {[{t:'Pick your dates',d:'Start with a quick quote using the calculator.'},{t:'Reserve with a deposit',d:'We’ll send a secure link to hold your dates.'},{t:'We deliver & set up',d:'Show up and enjoy. We’ll handle the heavy lifting.'}].map((x,i)=>(
            <Card key={x.t}><CardHeader><CardTitle className="flex items-center gap-2"><span className="inline-flex w-7 h-7 rounded-full bg-amber-600 text-white items-center justify-center text-sm">{'{'}i+1{'}'}</span>{'{'}x.t{'}'}</CardTitle></CardHeader><CardContent className="text-slate-600">{'{'}x.d{'}'}</CardContent></Card>
          ))}
        </div>
      </Section>

      <Section id="faq" title="FAQ" subtitle="If you don’t see your question here, just text us — 832‑577‑9523.">
        <div className="grid md:grid-cols-2 gap-6">
          {[
            {q:'What’s included?',a:'Linens/towels available, cookware, utensils, TP, and cleaning basics. Add a generator, chairs, and yard games as needed.'},
            {q:'Can I tow it myself?',a:'Yes with a 3/4‑ton truck or bigger. Otherwise choose delivery and we’ll set it up for you.'},
            {q:'How do packages work?',a:`Weekend pickup (${'{'}RATES.packages.weekendPickup{'}'}) or weekend delivery ≤40mi (${'{'}RATES.packages.weekendDelivery40{'}'}) are flat rates. Sunday–Sunday pickup is ${'{'}RATES.packages.sundayToSundayPickup{'}'}.`},
            {q:'Is the deposit refundable?',a:'It’s a temporary $1,000 authorization hold released after the post‑trip inspection.'},
          ].map(item=>(<Card key={item.q}><CardHeader><CardTitle>{'{'}item.q{'}'}</CardTitle></CardHeader><CardContent className="text-slate-600">{'{'}item.a{'}'}</CardContent></Card>))}
        </div>
      </Section>

      <Section id="contact" title="Let’s Plan Your Trip" subtitle="Call or text anytime, or send the booking request above.">
        <div className="grid md:grid-cols-3 gap-6">
          <Card><CardHeader><CardTitle className="flex items-center gap-2"><Phone className="w-5 h-5"/> Phone</CardTitle></CardHeader><CardContent>832‑577‑9523</CardContent></Card>
          <Card><CardHeader><CardTitle className="flex items-center gap-2"><Mail className="w-5 h-5"/> Email</CardTitle></CardHeader><CardContent>tyler@towawaycamping.co</CardContent></Card>
          <Card><CardHeader><CardTitle className="flex items-center gap-2"><MapPin className="w-5 h-5"/> Service Area</CardTitle></CardHeader><CardContent>Greater Houston • La Porte • Trinity, TX</CardContent></Card>
        </div>
      </Section>

      <footer className="border-t py-8 text-center text-sm text-slate-600">
        © { '{'}new Date().getFullYear(){'}' } Rovix — Adventure Delivered.
      </footer>
    </div>
  );
}
