'use client';

import { useTranslations } from 'next-intl';
import { Card, CardBody, User } from "@heroui/react";
import { TrendingUp, List, Clock, AlertCircle } from "lucide-react";

// Components
import StatsCard from "../../components/dashboard/StatsCard";
import JobRadar from "../../components/dashboard/JobRadar";
import QuickActions from "../../components/dashboard/QuickActions";
import ThemeSwitcher from "../../components/ThemeSwitcher";
import LanguageSwitcher from "../../components/LanguageSwitcher";

export default function Home() {
  const t = useTranslations('Dashboard');

  return (
    <div className="min-h-screen bg-[var(--bg-app)] text-[var(--text-main)] p-4 md:p-8 transition-colors duration-300">

      {/* 1. Header Section */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
            {t('title', { defaultValue: 'SignageERP' })}
          </h1>
          <p className="text-[var(--text-muted)] mt-1">
            {t('welcome', { defaultValue: 'Welcome back, Manager' })}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <ThemeSwitcher />
          <LanguageSwitcher />
          <div className="h-8 w-[1px] bg-gray-200 dark:bg-gray-800 mx-1"></div>
          <User
            name="Akkarapol"
            description="Owner"
            avatarProps={{
              src: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
              isBordered: true,
              color: "primary"
            }}
          />
        </div>
      </header>

      {/* 2. Stats Row (The Pulse) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title={t('totalSales', { defaultValue: 'Today Sales' })}
          value="฿12,500"
          trend={12}
          icon={<TrendingUp size={24} />}
          color="success"
        />
        <StatsCard
          title={t('pendingOrders', { defaultValue: 'Pending Orders' })}
          value="5"
          trend={-5}
          icon={<List size={24} />}
          color="warning"
        />
        <StatsCard
          title={t('urgentJobs', { defaultValue: 'Urgent Jobs' })}
          value="2"
          icon={<Clock size={24} />}
          color="danger"
        />
        <StatsCard
          title="Design Revisions"
          value="3"
          icon={<AlertCircle size={24} />}
          color="primary"
        />
      </div>

      {/* 3. Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Column (Main): Job Radar & Active List */}
        <div className="lg:col-span-2 space-y-6">
          <JobRadar />

          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-[var(--text-main)]">Recent Activity</h3>
            <button className="text-sm text-blue-500 hover:underline">View All</button>
          </div>

          {/* Activity Feed Placeholder */}
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="bg-[var(--bg-card)] border-none shadow-sm">
                <CardBody className="flex flex-row items-center justify-between p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <p className="text-sm text-[var(--text-main)]">New order <strong>#ORD-00{i}</strong> created by Customer A</p>
                  </div>
                  <span className="text-xs text-[var(--text-muted)]">2m ago</span>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>

        {/* Right Column (Side): Quick Actions & Calendar */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-[var(--text-main)]">Quick Actions</h3>
          <QuickActions />

          <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-none mt-6">
            <CardBody className="p-6">
              <h4 className="font-bold text-lg mb-2">Pro Tip</h4>
              <p className="text-sm opacity-90">Switch to Dark Mode in the evening to reduce eye strain during production checks.</p>
            </CardBody>
          </Card>
        </div>

      </div>

    </div>
  );
}
