'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import { MapPin, CheckCircle, AlertCircle, Building } from 'lucide-react'
import type { MosqueStats } from '@/lib/types/mosques'

interface MosqueStatsCardsProps {
  stats: MosqueStats
  loading: boolean
}

export default function MosqueStatsCards({ stats, loading }: MosqueStatsCardsProps) {
  const statCards = [
    {
      title: 'Total Mosques',
      value: stats.total.toLocaleString(),
      description: 'Registered mosques in database',
      icon: Building,
      color: 'blue'
    },
    {
      title: 'This Month',
      value: stats.thisMonth.toLocaleString(),
      description: `${stats.thisWeek} added this week`,
      icon: MapPin,
      color: 'purple'
    },
    {
      title: 'Timezones',
      value: Object.keys(stats.byTimezone).length.toLocaleString(),
      description: 'Different timezone regions',
      icon: CheckCircle,
      color: 'green'
    },
    {
      title: 'With Facilities',
      value: Object.keys(stats.byFacility).length.toLocaleString(),
      description: 'Different facility types tracked',
      icon: AlertCircle,
      color: 'orange'
    }
  ]

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-600',
      green: 'bg-green-50 text-green-600',
      purple: 'bg-purple-50 text-purple-600',
      orange: 'bg-orange-50 text-orange-600'
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((card) => {
        const Icon = card.icon
        return (
          <Card key={card.title} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${getColorClasses(card.color)}`}>
                <Icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">
                {card.description}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
} 