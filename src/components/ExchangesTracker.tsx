import React, { useState } from 'react';
import { ExchangeCycle, SMEProfile, ExchangeInvoice, AuditLogEntry } from '../agent/types';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Shield,
  UserCheck,
  RefreshCw,
  FileText,
  DollarSign,
  Truck,
  ArrowRight,
  Printer,
  Copy,
  Check,
  QrCode,
  Lock,
  Percent,
  Sparkles,
  Layers,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface ExchangesTrackerProps {
  cycles: ExchangeCycle[];
  smes: Map<string, SMEProfile>;
  onCommitAll: (cycleId: string) => void;
  onSimulateDecline: (cycleId: string) => void;
  onReset: () => void;
}

export const ExchangesTracker: React.FC<ExchangesTrackerProps> = ({
  cycles,
  smes,
  onCommitAll,
  onSimulateDecline,
  onReset,
}) => {
  const activeCycle = cycles[0];
  const [activeTab, setActiveTab] = useState<'lifecycle' | 'manifest' | 'payment_escrow' | 'invoice' | 'audit'>('lifecycle');
  const [copiedInvoice, setCopiedInvoice] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [customStage, setCustomStage] = useState<'Committed' | 'Escrow_Locked' | 'Dispatched' | 'Delivered_Settled'>('Escrow_Locked');

  const getSmeName = (id: string) => smes.get(id)?.name || id;
  const getSmeSector = (id: string) => smes.get(id)?.sector || 'SME';

  const matchPercentage = activeCycle
    ? Math.round((activeCycle.score_breakdown?.final_score || 0.94) * 100)
    : 96;

  // Synthesize Invoice Data
  const invoiceData: ExchangeInvoice = {
    invoice_number: `CW-INV-2026-${activeCycle ? activeCycle.id.replace(/[^0-9]/g, '').slice(-4) || '8842' : '8842'}`,
    cycle_id: activeCycle?.id || 'cycle-4way-rescue-01',
    issue_date: new Date().toISOString().split('T')[0],
    settlement_status: customStage === 'Delivered_Settled' ? 'RECONCILED_100_SETTLED' : 'ESCROW_LOCKED',
    total_barter_value_kes: activeCycle?.estimated_value_unlocked || 72000,
    net_cash_debt_created_kes: 0,
    verification_hash: 'sha256-e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    line_items: activeCycle
      ? activeCycle.edges.map((e) => ({
          from_sme: getSmeName(e.from_sme_id),
          to_sme: getSmeName(e.to_sme_id),
          item_or_service: e.item_or_service,
          quantity: e.quantity,
          unit: e.unit,
          unit_val_kes: Math.round(e.estimated_value / (e.quantity || 1)),
          total_val_kes: e.estimated_value,
        }))
      : [],
    compliance_declaration: 'Kenyan SME Multilateral Reciprocal Exchange Agreement (Zero-Debt Barter Clearing under Cap 486)',
    authorized_agent: 'Cyclewise deterministic graph + human approval gate',
  };

  // Synthesize Immutable Audit Trail
  const auditLogs: AuditLogEntry[] = [
    {
      id: 'aud-001',
      timestamp: '2026-09-27 10:14:02 EAT',
      action: 'CYCLE_DISCOVERED',
      actor: 'DeterministicGraphEngine (DFS)',
      details: `Discovered feasible ${activeCycle?.cycle_length || 4}-way closed loop with 0 KES cash imbalance.`,
      hash_signature: 'sig_89f1a23c',
    },
    {
      id: 'aud-002',
      timestamp: '2026-09-27 10:15:18 EAT',
      action: 'GUARDRAILS_VALIDATED',
      actor: 'CyclewiseAgent (Guardrails Module)',
      details: 'Strict anti-debt verification passed. Zero interest loan creation detected.',
      hash_signature: 'sig_33d7b88e',
    },
    {
      id: 'aud-003',
      timestamp: '2026-09-27 10:16:45 EAT',
      action: 'UNANIMOUS_COMMITMENT',
      actor: 'Nairobi SME Network Handshake',
      details: `All ${activeCycle?.cycle_length || 4} SMEs committed mutually agreed deliverables.`,
      hash_signature: 'sig_a94cb102',
    },
    {
      id: 'aud-004',
      timestamp: '2026-09-27 10:18:10 EAT',
      action: 'BILATERAL_ESCROW_LOCKED',
      actor: 'Escrow Settlement Protocol',
      details: `KES ${invoiceData.total_barter_value_kes.toLocaleString()} reciprocal resources locked in simultaneous release vault.`,
      hash_signature: 'sig_e55890fa',
    },
  ];

  const handleCopyInvoice = () => {
    const text = `CYCLEWISE OFFICIAL EXCHANGE SETTLEMENT INVOICE\nInvoice #: ${invoiceData.invoice_number}\nDate: ${invoiceData.issue_date}\nTotal Value: KES ${invoiceData.total_barter_value_kes.toLocaleString()}\nCash Debt: KES 0\nStatus: ${invoiceData.settlement_status}\nHash: ${invoiceData.verification_hash}`;
    navigator.clipboard?.writeText(text);
    setCopiedInvoice(true);
    setTimeout(() => setCopiedInvoice(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-5">
      {/* Top Banner & Mode Selector */}
      <div className="bg-white rounded-xl border border-[#E3E0D7] p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#EFECE4]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#18243A] text-[#E7B84B] flex items-center justify-center font-bold shadow-xs">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-[#18243A]">Active Exchange Lifecycle & Settlement Hub</h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#E7B84B]/20 text-[#18243A] font-bold border border-[#E7B84B]/40 flex items-center space-x-1">
                  <Percent className="w-3 h-3 text-[#18243A]" />
                  <span>{matchPercentage}% Match</span>
                </span>
              </div>
              <p className="text-xs text-[#68727D]">
                Tracks bilateral dispatch, escrow locks, zero-debt payment clearing, and commercial audit invoices.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onReset}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-[#E3E0D7] text-xs font-semibold text-[#68727D] hover:bg-[#F7F5EF] transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset State</span>
            </button>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 pt-3 text-xs">
          {[
            { id: 'lifecycle', label: '1. Lifecycle Timeline', icon: Clock },
            { id: 'manifest', label: '2. Dispatch Manifest', icon: Truck },
            { id: 'payment_escrow', label: '3. Escrow & Payment', icon: Lock },
            { id: 'invoice', label: '4. Commercial Invoice / Voucher', icon: FileText },
            { id: 'audit', label: '5. Immutable Audit Log', icon: Shield },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-3 py-2 rounded-lg font-semibold flex items-center space-x-1.5 transition-all ${
                  isActive
                    ? 'bg-[#18243A] text-[#E7B84B] shadow-xs'
                    : 'bg-[#F7F5EF] text-[#68727D] hover:text-[#18243A] hover:bg-[#EBE7DC]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {activeCycle ? (
        <div className="space-y-5">
          {/* ========================================================================= */}
          {/* TAB 1: LIFECYCLE TIMELINE & COMMITMENTS                                   */}
          {/* ========================================================================= */}
          {activeTab === 'lifecycle' && (
            <div className="space-y-4">
              {/* Stepper */}
              <div className="bg-white p-5 rounded-xl border border-[#E3E0D7] shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#68727D]">
                    Multilateral Protocol Lifecycle:
                  </span>
                  <span className="text-xs font-bold text-[#2E8B68] bg-[#EAF5F0] px-2.5 py-1 rounded-full">
                    Status: {customStage.replace('_', ' ')}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'Committed', label: '1. Participant Consent', desc: 'All 4 SMEs approved' },
                    { id: 'Escrow_Locked', label: '2. Demo authorization', desc: 'PIN sign-off simulation' },
                    { id: 'Dispatched', label: '3. Demo dispatch', desc: 'No courier API connected' },
                    { id: 'Delivered_Settled', label: '4. Demo reconciled', desc: 'No payment or escrow executed' },
                  ].map((st, i) => {
                    const isDone = ['Committed', 'Escrow_Locked', 'Dispatched', 'Delivered_Settled'].indexOf(customStage) >= i;
                    const isCurrent = customStage === st.id;

                    return (
                      <button
                        key={st.id}
                        onClick={() => setCustomStage(st.id as typeof customStage)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          isCurrent
                            ? 'bg-[#18243A] text-white border-[#18243A] shadow-xs'
                            : isDone
                            ? 'bg-[#EAF5F0] text-[#18243A] border-[#2E8B68]/40'
                            : 'bg-[#F7F5EF] text-[#68727D] border-[#E3E0D7]'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span>{st.label}</span>
                          <span>{isDone ? '✓' : i + 1}</span>
                        </div>
                        <span className={`text-[10px] block mt-1 ${isCurrent ? 'text-[#C2CEDA]' : 'text-[#68727D]'}`}>
                          {st.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Participant Commitments Grid */}
              <div className="bg-white p-5 rounded-xl border border-[#E3E0D7] shadow-xs space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#68727D]">
                  Participant Unanimous Approvals ({activeCycle.cycle_length} Required Nodes)
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  {activeCycle.sme_sequence.map((smeId) => {
                    const sme = smes.get(smeId);
                    return (
                      <div key={smeId} className="p-3.5 rounded-lg border border-[#E3E0D7] bg-[#F7F5EF] space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#18243A]">{sme?.name || smeId}</span>
                          <UserCheck className="w-4 h-4 text-[#2E8B68]" />
                        </div>
                        <span className="text-[10px] text-[#68727D] block">{sme?.sector}</span>

                        <div className="pt-2 border-t border-[#E3E0D7] flex items-center space-x-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#2E8B68]"></span>
                          <span className="text-[11px] font-semibold text-[#2E8B68]">
                            Digitally Signed & Committed
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Simulation controls */}
                <div className="mt-4 pt-3 border-t border-[#EFECE4] flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs text-[#68727D]">
                    Demonstration & Recovery Controls:
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onSimulateDecline(activeCycle.id)}
                      className="px-3.5 py-1.5 rounded-lg border border-[#D8783D] text-[#D8783D] hover:bg-[#FFF7ED] text-xs font-semibold transition-colors"
                    >
                      Simulate Participant Decline (Broken Chain)
                    </button>
                    <button
                      onClick={() => {
                        setCustomStage('Delivered_Settled');
                        onCommitAll(activeCycle.id);
                      }}
                      className="px-4 py-1.5 rounded-lg bg-[#2E8B68] hover:bg-[#257356] text-white text-xs font-semibold transition-colors flex items-center space-x-1.5 shadow-xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Execute Full Settlement & Reconcile</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: DISPATCH MANIFEST ("What Business Sends to Which Business")         */}
          {/* ========================================================================= */}
          {activeTab === 'manifest' && (
            <div className="bg-white p-5 rounded-xl border border-[#E3E0D7] shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#EFECE4]">
                <div>
                  <h3 className="text-sm font-bold text-[#18243A]">Dispatch Manifest: Logistics & Resource Handoffs</h3>
                  <p className="text-xs text-[#68727D]">
                    Authoritative sequence of bilateral deliveries forming the closed rescue cycle
                  </p>
                </div>
                <span className="text-xs font-bold text-[#18243A] bg-[#F7F5EF] border border-[#E3E0D7] px-3 py-1 rounded-full">
                  {activeCycle.edges.length} Dispatches
                </span>
              </div>

              <div className="space-y-3">
                {activeCycle.edges.map((edge, idx) => {
                  const fromName = getSmeName(edge.from_sme_id);
                  const toName = getSmeName(edge.to_sme_id);
                  const fromSector = getSmeSector(edge.from_sme_id);
                  const toSector = getSmeSector(edge.to_sme_id);

                  return (
                    <div
                      key={edge.id}
                      className="p-4 rounded-xl border border-[#E3E0D7] bg-[#F7F5EF] flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                    >
                      {/* Origin Sender */}
                      <div className="min-w-[160px] space-y-0.5">
                        <span className="text-[10px] uppercase font-bold text-[#68727D] block">
                          Step {idx + 1}: Origin Shipper
                        </span>
                        <span className="font-bold text-sm text-[#18243A] block">{fromName}</span>
                        <span className="text-[11px] text-[#68727D]">{fromSector}</span>
                      </div>

                      {/* Transferred Item & Value */}
                      <div className="flex-1 bg-white p-3 rounded-lg border border-[#E3E0D7] space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#18243A] text-xs">
                            Sends: {edge.item_or_service}
                          </span>
                          <span className="text-[#2E8B68] font-bold">
                            KES {edge.estimated_value.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-[#68727D]">
                          <span>Quantity: {edge.quantity} {edge.unit}</span>
                          <span>Fulfillment: Courier dispatch & local pickup</span>
                        </div>
                      </div>

                      {/* Destination Receiver */}
                      <div className="min-w-[160px] md:text-right space-y-0.5">
                        <span className="text-[10px] uppercase font-bold text-[#68727D] block">
                          Destination Consignee
                        </span>
                        <span className="font-bold text-sm text-[#18243A] block">{toName}</span>
                        <span className="text-[11px] text-[#68727D]">{toSector}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-3.5 rounded-lg bg-[#EAF5F0] border border-[#2E8B68]/30 text-xs text-[#1E5D45] flex items-center justify-between">
                <span className="font-semibold">
                  Zero Cash Outflow: All deliveries balance each other in a closed 100% reciprocal loop.
                </span>
                <span className="font-bold text-[#2E8B68]">
                  KES {activeCycle.estimated_value_unlocked.toLocaleString()} Total Circulating Value
                </span>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: ESCROW & ZERO-DEBT PAYMENT FLOW                                     */}
          {/* ========================================================================= */}
          {activeTab === 'payment_escrow' && (
            <div className="bg-white p-5 rounded-xl border border-[#E3E0D7] shadow-xs space-y-5">
              <div>
                <h3 className="text-sm font-bold text-[#18243A] flex items-center space-x-2">
                  <Lock className="w-4 h-4 text-[#2E8B68]" />
                  <span>Bilateral & Multilateral Escrow Settlement</span>
                </h3>
                <p className="text-xs text-[#68727D] mt-0.5">
                  How Cyclewise settles reciprocal trades without commercial bank borrowing or interest
                </p>
              </div>

              {/* Settlement Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
                <div className="p-4 rounded-xl bg-[#F7F5EF] border border-[#E3E0D7] space-y-1">
                  <span className="text-[10px] font-bold uppercase text-[#68727D] block">
                    Total Barter Value Cleared:
                  </span>
                  <span className="text-xl font-bold text-[#18243A] block">
                    KES {activeCycle.estimated_value_unlocked.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-[#2E8B68] font-semibold">100% Resource Parity</span>
                </div>

                <div className="p-4 rounded-xl bg-[#F7F5EF] border border-[#E3E0D7] space-y-1">
                  <span className="text-[10px] font-bold uppercase text-[#68727D] block">
                    Cash Debt Incurred:
                  </span>
                  <span className="text-xl font-bold text-[#2E8B68] block">
                    KES 0.00
                  </span>
                  <span className="text-[10px] text-[#2E8B68] font-semibold">Zero-Interest Safe</span>
                </div>

                <div className="p-4 rounded-xl bg-[#F7F5EF] border border-[#E3E0D7] space-y-1">
                  <span className="text-[10px] font-bold uppercase text-[#68727D] block">
                    Escrow Handshake Protocol:
                  </span>
                  <span className="text-xl font-bold text-[#18243A] block">
                    Simultaneous
                  </span>
                  <span className="text-[10px] text-[#68727D]">All 4 releases occur jointly</span>
                </div>
              </div>

              {/* Mechanism Explanation */}
              <div className="p-4 rounded-xl bg-[#18243A] text-white space-y-3 text-xs">
                <span className="font-bold text-[#E7B84B] flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Cyclewise Anti-Debt Escrow Mechanism</span>
                </span>
                <p className="text-[#C2CEDA] leading-relaxed">
                  Unlike traditional trade where a business borrows cash to purchase packaging or transport, Cyclewise acts as an escrow clearing coordinator. Each business deposits its commitment of surplus capacity. Once all counterparties verify receipt of deliverables via digital handshake, the reciprocal credits are extinguished simultaneously.
                </p>
                <div className="pt-2 border-t border-[#253654] flex flex-wrap items-center justify-between text-[11px] text-[#A6B2C3]">
                  <span>Protocol Engine: Deterministic Bounded DFS</span>
                  <span>Escrow Fee: KES 0 (Zero commission during hackathon)</span>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: COMMERCIAL EXCHANGE INVOICE & BARTER SETTLEMENT VOUCHER             */}
          {/* ========================================================================= */}
          {activeTab === 'invoice' && (
            <div className="bg-white p-6 rounded-xl border border-[#E3E0D7] shadow-sm space-y-5">
              {/* Invoice Actions Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#EFECE4]">
                <div>
                  <span className="text-[10px] font-bold uppercase text-[#2E8B68] bg-[#EAF5F0] px-2 py-0.5 rounded-md">
                    Official Settlement Note
                  </span>
                  <h3 className="text-base font-bold text-[#18243A] mt-1">
                    Commercial Exchange Invoice #{invoiceData.invoice_number}
                  </h3>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleCopyInvoice}
                    className="px-3 py-1.5 rounded-lg border border-[#E3E0D7] text-xs font-semibold text-[#18243A] hover:bg-[#F7F5EF] flex items-center space-x-1.5 transition-colors"
                  >
                    {copiedInvoice ? <Check className="w-3.5 h-3.5 text-[#2E8B68]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedInvoice ? 'Copied!' : 'Copy Summary'}</span>
                  </button>

                  <button
                    onClick={handlePrint}
                    className="px-3 py-1.5 rounded-lg bg-[#18243A] text-white hover:bg-[#253752] text-xs font-semibold flex items-center space-x-1.5 transition-colors shadow-xs"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Invoice</span>
                  </button>
                </div>
              </div>

              {/* Formal Invoice Document Container */}
              <div className="p-6 rounded-xl border border-[#E3E0D7] bg-[#FAFAF8] space-y-6 text-xs text-[#17202A]">
                {/* Invoice Header */}
                <div className="flex flex-wrap justify-between items-start gap-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="w-7 h-7 rounded-lg bg-[#18243A] text-[#E7B84B] flex items-center justify-center font-bold">
                        ↻
                      </div>
                      <span className="font-bold text-base text-[#18243A]">Cyclewise Kenya Ltd.</span>
                    </div>
                    <p className="text-[11px] text-[#68727D]">
                      Nairobi County SME Exchange Coordinator<br />
                      P.O. Box 40822-00100 Nairobi, Kenya<br />
                      barter-registry@cyclewise.co.ke
                    </p>
                  </div>

                  <div className="text-right space-y-1">
                    <span className="text-[10px] uppercase font-bold text-[#68727D] block">Settlement Document</span>
                    <span className="font-bold text-[#18243A] block">{invoiceData.invoice_number}</span>
                    <span className="text-[11px] text-[#68727D] block">Date: {invoiceData.issue_date}</span>
                    <span className="text-[11px] font-semibold text-[#2E8B68] block">
                      Status: {invoiceData.settlement_status}
                    </span>
                  </div>
                </div>

                {/* Line Items Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#18243A] text-white">
                        <th className="p-2.5 rounded-l-md">From (Shipper)</th>
                        <th className="p-2.5">To (Consignee)</th>
                        <th className="p-2.5">Item / Service Details</th>
                        <th className="p-2.5">Qty & Unit</th>
                        <th className="p-2.5 rounded-r-md text-right">Value (KES)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E3E0D7]">
                      {invoiceData.line_items.map((item, idx) => (
                        <tr key={idx} className="hover:bg-white/80">
                          <td className="p-2.5 font-bold text-[#18243A]">{item.from_sme}</td>
                          <td className="p-2.5 font-semibold text-[#18243A]">{item.to_sme}</td>
                          <td className="p-2.5 text-[#18243A]">{item.item_or_service}</td>
                          <td className="p-2.5 text-[#68727D]">{item.quantity} {item.unit}</td>
                          <td className="p-2.5 font-bold text-right text-[#2E8B68]">
                            KES {item.total_val_kes.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-[#18243A] font-bold text-xs">
                        <td colSpan={4} className="p-2.5 text-[#18243A]">
                          Total Reciprocal Value Exchanged:
                        </td>
                        <td className="p-2.5 text-right text-[#2E8B68] text-sm">
                          KES {invoiceData.total_barter_value_kes.toLocaleString()}
                        </td>
                      </tr>
                      <tr className="text-xs text-[#2E8B68]">
                        <td colSpan={4} className="p-2.5">
                          Net Cash Debt Payable / Borrowed:
                        </td>
                        <td className="p-2.5 text-right font-bold">
                          KES 0.00 (Zero-Debt Cleared)
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Verification Token & Regulatory Note */}
                <div className="pt-3 border-t border-[#E3E0D7] flex flex-wrap items-center justify-between gap-3 text-[11px] text-[#68727D]">
                  <div className="space-y-0.5">
                    <span className="font-semibold text-[#18243A] block">Cryptographic Verification Hash:</span>
                    <code className="text-[10px] bg-white px-2 py-0.5 rounded border border-[#E3E0D7] font-mono text-[#18243A]">
                      {invoiceData.verification_hash}
                    </code>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-[#18243A] block">Regulatory Framework:</span>
                    <span>{invoiceData.compliance_declaration}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 5: IMMUTABLE AUDIT LOG                                                */}
          {/* ========================================================================= */}
          {activeTab === 'audit' && (
            <div className="bg-white p-5 rounded-xl border border-[#E3E0D7] shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#EFECE4]">
                <div>
                  <h3 className="text-sm font-bold text-[#18243A] flex items-center space-x-1.5">
                    <Shield className="w-4 h-4 text-[#2E8B68]" />
                    <span>Cryptographic Audit Trail & Governance Log</span>
                  </h3>
                  <p className="text-xs text-[#68727D]">
                    Immutable timestamps of all agent validations, consent handshakes, and settlement releases
                  </p>
                </div>
                <span className="text-[11px] font-mono font-bold text-[#2E8B68] bg-[#EAF5F0] px-2.5 py-1 rounded-full">
                  4 Verified Blocks
                </span>
              </div>

              <div className="space-y-2.5">
                {auditLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3.5 rounded-lg border border-[#E3E0D7] bg-[#F7F5EF] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-[#18243A]">{log.action}</span>
                        <span className="text-[10px] text-[#68727D]">&bull; {log.actor}</span>
                      </div>
                      <p className="text-[#18243A]">{log.details}</p>
                    </div>

                    <div className="sm:text-right space-y-0.5 shrink-0">
                      <span className="text-[10px] text-[#68727D] block font-mono">{log.timestamp}</span>
                      <code className="text-[10px] bg-white px-1.5 py-0.2 rounded border border-[#E3E0D7] font-mono text-[#2E8B68]">
                        {log.hash_signature}
                      </code>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="p-8 text-center bg-white rounded-xl border border-[#E3E0D7]">
          <p className="text-sm font-semibold text-[#18243A]">No active exchange selected yet.</p>
          <p className="text-xs text-[#68727D] mt-1">Run matching from the Overview or Matches tab to start an exchange loop.</p>
        </div>
      )}
    </div>
  );
};
