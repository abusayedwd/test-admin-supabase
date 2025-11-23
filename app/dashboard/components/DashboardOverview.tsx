'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import { Users, MessageSquareWarning, BookOpen, MapPin, TrendingUp, AlertCircle } from 'lucide-react'
import Link from 'next/link'

interface DashboardStats {
  totalUsers: number
  subscriptionUsers: number
  pendingReports: number
  quranRequests: number
  totalMosques: number
  isLoading: boolean
}

export default function DashboardOverview() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    subscriptionUsers: 0,
    pendingReports: 0,
    quranRequests: 0,
    totalMosques: 0,
    isLoading: true
  })

  useEffect(() => {
    // Real data loading
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/dashboard-stats')
        
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard stats')
        }

        const data = await response.json()
        setStats({
          totalUsers: data.totalUsers || 0,
          subscriptionUsers: data.subscriptionUsers || 0,
          pendingReports: data.pendingReports || 0,
          quranRequests: data.quranRequests || 0,
          totalMosques: data.totalMosques || 0,
          isLoading: false
        })
      } catch (error) {
        console.error('Error fetching dashboard stats:', error)
        setStats({
          totalUsers: 0,
          subscriptionUsers: 0,
          pendingReports: 0,
          quranRequests: 0,
          totalMosques: 0,
          isLoading: false
        })
      }
    }

    fetchStats()
  }, [])

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      description: `+${stats.subscriptionUsers} with subscriptions`,
      icon: Users,
      color: 'blue',
      href: '/dashboard/users'
    },
    {
      title: 'Pending Reports',
      value: stats.pendingReports.toLocaleString(),
      description: 'Require moderation',
      icon: MessageSquareWarning,
      color: 'orange',
      href: '/dashboard/reports'
    },
    {
      title: 'Quran Requests',
      value: stats.quranRequests.toLocaleString(),
      description: 'Pending fulfillment',
      icon: BookOpen,
      color: 'green',
      href: '/dashboard/quran-requests'
    },
    {
      title: 'Mosques',
      value: stats.totalMosques.toLocaleString(),
      description: 'Location database',
      icon: MapPin,
      color: 'purple',
      href: '/dashboard/mosques'
    }
  ]

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-600',
      orange: 'bg-orange-50 text-orange-600',
      green: 'bg-green-50 text-green-600',
      purple: 'bg-purple-50 text-purple-600'
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  if (stats.isLoading) {
    return (
      <div className="space-y-6">
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
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <Card key={card.title} className="hover:shadow-lg transition-shadow cursor-pointer">
              <Link href={card.href}>
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
              </Link>
            </Card>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="mr-2 h-5 w-5 text-orange-500" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Common administrative tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button asChild variant="outline" size="sm">
                <Link href="/dashboard/users">
                  <Users className="mr-2 h-4 w-4" />
                  Manage Users
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/dashboard/reports">
                  <MessageSquareWarning className="mr-2 h-4 w-4" />
                  Review Reports
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/dashboard/quran-requests">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Quran Requests
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/dashboard/mosques">
                  <MapPin className="mr-2 h-4 w-4" />
                  Mosque Data
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-green-500" />
              System Status
            </CardTitle>
            <CardDescription>
              Application health overview
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Database</span>
              <span className="text-sm font-medium text-green-600">Online</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Authentication</span>
              <span className="text-sm font-medium text-green-600">Active</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">API Status</span>
              <span className="text-sm font-medium text-green-600">Operational</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Last Updated</span>
              <span className="text-sm text-gray-500">Just now</span>
            </div>
          </CardContent>
        </Card>
      </div>


    </div>
  )
} 