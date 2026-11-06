import { QRCodeSVG } from "qrcode.react";
import Barcode from "react-barcode";
import { Leaf, RotateCw, ScanLine, X } from "lucide-react";
import { useState } from "react";
import { POINT_VALUE_FCFA, xaf } from "@/lib/agro-data";
import { useAgro } from "@/lib/agro-store";

export function LoyaltyCard() {
  const { tier, points } = useAgro();
  const [flipped, setFlipped] = useState(false);
  const [scan, setScan] = useState(false);
  const custId = `AH-${tier.id.toUpperCase().slice(0, 3)}-${(points * 7 + 1043).toString().slice(-6).padStart(6, "0")}`;

  return (
    <>
      <div className="perspective">
        <button
          onClick={() => setFlipped((f) => !f)}
          className={`relative block aspect-[1.586] w-full transition-transform duration-700 preserve-3d cursor-pointer ${flipped ? "rotate-y-180" : ""}`}
          aria-label="Flip loyalty card"
        >
          <div className={`absolute inset-0 overflow-hidden rounded-3xl p-5 text-left shadow-card border border-white/20 backface-hidden ${tier.cardClass}`}>
            <div className="absolute inset-0 leaf-pattern opacity-70" />
            <div className="relative flex h-full flex-col justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/80">
                    <Leaf className="h-3.5 w-3.5 text-accent" /> Agro Hospital PLC
                  </p>
                  <p className="mt-1 text-lg font-extrabold tracking-tight text-white">{tier.name}</p>
                </div>
                <span className="rounded-full bg-white/20 backdrop-blur-md px-3 py-1 text-[10px] font-bold text-white border border-white/30 shadow-xs">
                  {tier.segment}
                </span>
              </div>

              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-white/75">Points Balance</p>
                <p className="text-3xl font-extrabold tracking-tight text-white mt-0.5">
                  {points.toLocaleString()} <span className="text-sm font-semibold opacity-90">pts</span>
                </p>
                <p className="text-xs text-white/85 font-medium mt-0.5">
                  = {xaf(points * POINT_VALUE_FCFA)} input value
                </p>
              </div>

              <div className="flex items-end justify-between text-xs border-t border-white/15 pt-2">
                <div>
                  <p className="text-[10px] text-white/70 uppercase font-semibold">{tier.customer}</p>
                  <p className="font-mono text-xs tracking-wider text-white font-bold">{custId}</p>
                </div>
                {tier.hasCommission && (
                  <div className="text-right">
                    <p className="text-[10px] text-white/70 uppercase font-semibold">Volume Rebate</p>
                    <p className="font-bold text-accent text-xs">{xaf(tier.commission)}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className={`absolute inset-0 flex flex-col items-center justify-center gap-2.5 rounded-3xl p-5 shadow-card border border-white/20 backface-hidden rotate-y-180 ${tier.cardClass}`}>
            <div className="rounded-2xl bg-white p-3 shadow-card">
              <QRCodeSVG value={custId} size={96} />
            </div>
            <p className="text-xs font-bold text-white mt-1">{tier.perk}</p>
            <p className="text-[10px] text-white/80 font-medium text-center">
              Earn {tier.ptsPer1000} pt / 1,000 XAF • 1 pt = {POINT_VALUE_FCFA} XAF
            </p>
          </div>
        </button>
      </div>

      <div className="mt-3 flex gap-2.5">
        <button
          onClick={() => setScan(true)}
          className="clay-btn-primary flex-1 flex items-center justify-center gap-2 rounded-2xl py-3 text-xs font-bold"
        >
          <ScanLine className="h-4 w-4" /> Scan at Branch Counter
        </button>
        <button
          onClick={() => setFlipped((f) => !f)}
          aria-label="Flip card"
          className="clay-btn-secondary rounded-2xl px-4 py-3 flex items-center justify-center"
        >
          <RotateCw className="h-4 w-4" />
        </button>
      </div>

      {scan && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-hero p-6 text-primary-foreground animate-in fade-in">
          <button onClick={() => setScan(false)} aria-label="Close" className="absolute right-5 top-5 rounded-full bg-card/20 p-2"><X className="h-5 w-5" /></button>
          <p className="text-2xl font-bold">{tier.name}</p>
          <div className="rounded-3xl bg-card p-5"><QRCodeSVG value={custId} size={220} /></div>
          <div className="rounded-2xl bg-card px-3 pt-2"><Barcode value={custId} height={60} width={1.6} fontSize={12} /></div>
          <p className="text-center text-sm opacity-90">Show this to the cashier to earn or redeem points.<br />{points.toLocaleString()} pts available</p>
        </div>
      )}
    </>
  );
}
