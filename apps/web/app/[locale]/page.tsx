'use client';

import { useTranslations } from 'next-intl';
import { TrendingUp, List, Clock, AlertCircle, ShoppingBag } from "lucide-react";

// Components
import StatsCard from "../../components/dashboard/StatsCard";
import JobRadar from "../../components/dashboard/JobRadar";
import QuickActions from "../../components/dashboard/QuickActions";

export default function Home() {
  const t = useTranslations('Dashboard');

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-12">
      {/* 2. Stats Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title={t('totalSales', { defaultValue: 'Today Sales' })}
          value="฿12,500"
          trend={12}
          icon={<TrendingUp size={20} className="text-cyan-400" />}
          className="glass-card p-6"
        />
        <StatsCard
          title={t('pendingOrders', { defaultValue: 'Pending' })}
          value="5"
          trend={-5}
          icon={<List size={20} className="text-magenta-400" />}
          className="glass-card p-6"
        />
        <StatsCard
          title={t('urgentJobs', { defaultValue: 'Urgent' })}
          value="2"
          icon={<Clock size={20} className="text-red-400" />}
          className="glass-card p-6 border-red-500/20"
        />
        <StatsCard
          title="Conversion"
          value="84%"
          trend={3}
          icon={<AlertCircle size={20} className="text-yellow-400" />}
          className="glass-card p-6"
        />
      </div>

      {/* 3. Main Operational Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Production Flux */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-1 overflow-hidden">
            <JobRadar />
          </div>

          <div className="flex justify-between items-center px-2">
            <h3 className="text-xl font-bold text-white">Live Operations</h3>
            <button className="text-sm font-bold text-cyan-400 hover:text-cyan-300 transition-colors uppercase tracking-widest">
              View Map
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="glass-card p-4 flex items-center justify-between group cursor-pointer hover:bg-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-cyan-400 border border-white/5 group-hover:border-cyan-500/30 transition-all">
                    <ShoppingBag size={24} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">#JOB-24020{i}</h4>
                    <p className="text-xs text-gray-500 uppercase tracking-tighter">Gold Vinyl Printing</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-cyan-400 block">Designing</span>
                  <span className="text-[10px] text-gray-600">2m ago</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Center */}
        <div className="space-y-6">
          <div className="glass-card p-6 bg-gradient-to-br from-cyan-500/10 to-transparent">
            <h3 className="text-lg font-bold text-white mb-4">Command Center</h3>
            <QuickActions />
          </div>

          <div className="glass-card p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-magenta-500/20 blur-2xl rounded-full -mr-12 -mt-12" />
            <h4 className="font-bold text-lg text-white mb-2 italic">Visionary Mode</h4>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Your production efficiency is up **15%** this week. High five! ✋
            </p>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full w-[85%] bg-gradient-to-r from-cyan-400 to-magenta-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
