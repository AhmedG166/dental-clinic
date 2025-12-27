'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Calendar,
  Users,
  DollarSign,
  Clock,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';

interface Appointment {
  id: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  appointmentDate: string;
  appointmentTime: string;
  status: string;
  service: { name: string; price: number };
  doctor: { firstName: string; lastName: string };
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication
    const isAuth = localStorage.getItem('adminAuth');
    if (!isAuth) {
      router.push('/admin/login');
      return;
    }

    // Fetch appointments
    fetchAppointments();
  }, [router]);

  const fetchAppointments = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/appointments');
      const data = await response.json();
      setAppointments(data.appointments || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate statistics
  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter(
    (apt) => apt.appointmentDate.split('T')[0] === today
  );

  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();
  const monthlyAppointments = appointments.filter((apt) => {
    const date = new Date(apt.appointmentDate);
    return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
  });

  const monthlyRevenue = monthlyAppointments.reduce(
    (sum, apt) => sum + apt.service.price,
    0
  );

  const pendingAppointments = appointments.filter(
    (apt) => apt.status === 'pending'
  );

  // Chart data - Appointments by day (last 7 days)
  const getLast7DaysData = () => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const count = appointments.filter(
        (apt) => apt.appointmentDate.split('T')[0] === dateStr
      ).length;
      data.push({
        date: date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        }),
        appointments: count,
      });
    }
    return data;
  };

  // Services revenue breakdown
  const getServiceRevenueData = () => {
    const serviceMap = new Map();
    appointments.forEach((apt) => {
      const serviceName = apt.service.name;
      const current = serviceMap.get(serviceName) || 0;
      serviceMap.set(serviceName, current + apt.service.price);
    });

    return Array.from(serviceMap.entries()).map(([name, revenue]) => ({
      name,
      revenue,
    }));
  };

  const chartData = getLast7DaysData();
  const revenueData = getServiceRevenueData();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="border-b border-gray-200 bg-white px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-sm text-gray-600">Welcome back, Admin 👋</p>
        </div>

        <div className="p-8">
          {/* Stats Cards */}
          <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white shadow-lg">
              <div className="mb-2 flex items-center justify-between">
                <Calendar className="h-8 w-8 opacity-80" />
                <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
                  Today
                </span>
              </div>
              <p className="text-3xl font-bold">{todayAppointments.length}</p>
              <p className="mt-1 text-sm text-blue-100">Today's Appointments</p>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-green-500 to-green-600 p-6 text-white shadow-lg">
              <div className="mb-2 flex items-center justify-between">
                <Users className="h-8 w-8 opacity-80" />
                <TrendingUp className="h-5 w-5" />
              </div>
              <p className="text-3xl font-bold">{appointments.length}</p>
              <p className="mt-1 text-sm text-green-100">Total Appointments</p>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 p-6 text-white shadow-lg">
              <div className="mb-2 flex items-center justify-between">
                <DollarSign className="h-8 w-8 opacity-80" />
                <span className="text-xs text-purple-100">This Month</span>
              </div>
              <p className="text-3xl font-bold">${monthlyRevenue.toLocaleString()}</p>
              <p className="mt-1 text-sm text-purple-100">Monthly Revenue</p>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 p-6 text-white shadow-lg">
              <div className="mb-2 flex items-center justify-between">
                <Clock className="h-8 w-8 opacity-80" />
                <AlertCircle className="h-5 w-5" />
              </div>
              <p className="text-3xl font-bold">{pendingAppointments.length}</p>
              <p className="mt-1 text-sm text-orange-100">Pending Approvals</p>
            </div>
          </div>

          {/* Charts */}
          <div className="mb-8 grid gap-6 lg:grid-cols-2">
            {/* Appointments Trend */}
            <div className="rounded-2xl bg-white p-6 shadow-lg">
              <h3 className="mb-4 text-lg font-bold text-gray-900">
                Appointments (Last 7 Days)
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="appointments"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Revenue by Service */}
            <div className="rounded-2xl bg-white p-6 shadow-lg">
              <h3 className="mb-4 text-lg font-bold text-gray-900">
                Revenue by Service
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Appointments Table */}
          <div className="rounded-2xl bg-white p-6 shadow-lg">
            <h3 className="mb-4 text-lg font-bold text-gray-900">
              Recent Appointments
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Patient
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Service
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Doctor
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Date & Time
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {appointments.slice(0, 10).map((apt) => (
                    <tr key={apt.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">
                          {apt.patientName}
                        </p>
                        <p className="text-xs text-gray-500">{apt.patientEmail}</p>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {apt.service.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        Dr. {apt.doctor.firstName} {apt.doctor.lastName}
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-gray-900">
                          {new Date(apt.appointmentDate).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-500">{apt.appointmentTime}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            apt.status === 'confirmed'
                              ? 'bg-green-100 text-green-700'
                              : apt.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-700'
                              : apt.status === 'cancelled'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {apt.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
