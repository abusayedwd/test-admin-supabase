'use client';

import { Card } from '@/app/components/ui/card';
import { Package, Clock, Send, CheckCircle, XCircle, Calendar, TrendingUp, Timer } from 'lucide-react';
import { QuranRequestStats } from '@/lib/types/quran-requests';

interface QuranRequestsStatsCardsProps {
  stats: QuranRequestStats;
}

export default function QuranRequestsStatsCards({ stats }: QuranRequestsStatsCardsProps) {
  const cards = [
    {
      title: 'Total Requests',
      value: stats.total,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Requested',
      value: stats.requested,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Processing',
      value: stats.processing,
      icon: Timer,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Sent',
      value: stats.sent,
      icon: Send,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Delivered',
      value: stats.delivered,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Cancelled',
      value: stats.cancelled,
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: 'This Week',
      value: stats.thisWeek,
      icon: Calendar,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    {
      title: 'This Month',
      value: stats.thisMonth,
      icon: TrendingUp,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card key={index} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {card.value.toLocaleString()}
                </p>
              </div>
              <div className={`p-3 rounded-full ${card.bgColor}`}>
                <Icon className={`h-6 w-6 ${card.color}`} />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
} 