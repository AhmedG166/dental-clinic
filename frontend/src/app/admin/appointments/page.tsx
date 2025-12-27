'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import {
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Trash2,
  Eye,
} from 'lucide-react';

interface Appointment {
  id: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  appointmentDate: string;
  appointmentTime: string;
  status: string;
  notes: string;
  service: { name: string; price: number };
  doctor: { firstName: string; lastName: string };
}

export default function AppointmentsManagementPage() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  useEffect(() => {
    const isAuth = localStorage.getItem('adminAuth');
    if (!isAuth) {
      router.push('/admin/login');
      return;
    }
    fetchAppointments();
  }, [router]);

  useEffect(() => {
    filterAppointments();
  }, [appointments, searchQuery, statusFilter]);

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

  const filterAppointments = () => {
    let filtered = appointments;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter((apt) => apt.status === statusFilter);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (apt) =>
          apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          apt.patientEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
          apt.service.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredAppointments(filtered);
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        fetchAppointments();
        alert(`Appointment ${status} successfully!`);
      }
    } catch (error) {
      console.error('Error updating appointment:', error);
      alert('Failed to update appointment');
    }
  };

  const deleteAppointment = async (id: string) => {
    if (!confirm('Are you sure you want to delete this appointment?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/appointments/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchAppointments();
        alert('Appointment deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting appointment:', error);
      alert('Failed to delete appointment');
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="text-gray-600">Loading appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="border-b border-gray-200 bg-white px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Appointments Management
          </h1>
          <p className="text-sm text-gray-600">
            Manage and track all patient appointments
          </p>
        </div>

        <div className="p-8">
          {/* Stats Summary */}
          <div className="mb-6 grid gap-4 md:grid-cols-4">
            <div className="rounded-xl bg-white p-4 shadow-md">
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{appointments.length}</p>
            </div>
            <div className="rounded-xl bg-green-50 p-4 shadow-md">
              <p className="text-sm text-green-700">Confirmed</p>
              <p className="text-2xl font-bold text-green-600">
                {appointments.filter((a) => a.status === 'confirmed').length}
              </p>
            </div>
            <div className="rounded-xl bg-yellow-50 p-4 shadow-md">
              <p className="text-sm text-yellow-700">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                {appointments.filter((a) => a.status === 'pending').length}
              </p>
            </div>
            <div className="rounded-xl bg-blue-50 p-4 shadow-md">
              <p className="text-sm text-blue-700">Completed</p>
              <p className="text-2xl font-bold text-blue-600">
                {appointments.filter((a) => a.status === 'completed').length}
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-6 flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-lg md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 items-center gap-2">
              <Search className="h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by patient name, email, or service..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 border-0 bg-transparent focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-600 focus:outline-none"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Appointments Table */}
          <div className="rounded-2xl bg-white shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Patient Info
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Service
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Doctor
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Date & Time
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredAppointments.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                        No appointments found
                      </td>
                    </tr>
                  ) : (
                    filteredAppointments.map((apt) => (
                      <tr key={apt.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold text-gray-900">{apt.patientName}</p>
                            <p className="text-xs text-gray-500">{apt.patientEmail}</p>
                            <p className="text-xs text-gray-500">{apt.patientPhone}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-medium text-gray-900">{apt.service.name}</p>
                          <p className="text-xs text-gray-500">${apt.service.price}</p>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          Dr. {apt.doctor.firstName} {apt.doctor.lastName}
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-gray-900">
                            {new Date(apt.appointmentDate).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-gray-500">{apt.appointmentTime}</p>
                        </td>
                        <td className="px-6 py-4">
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
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {apt.status === 'pending' && (
                              <button
                                onClick={() => updateStatus(apt.id, 'confirmed')}
                                className="rounded-lg bg-green-100 p-2 text-green-600 hover:bg-green-200"
                                title="Confirm"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </button>
                            )}
                            {apt.status === 'confirmed' && (
                              <button
                                onClick={() => updateStatus(apt.id, 'completed')}
                                className="rounded-lg bg-blue-100 p-2 text-blue-600 hover:bg-blue-200"
                                title="Mark as Completed"
                              >
                                <Clock className="h-4 w-4" />
                              </button>
                            )}
                            {apt.status !== 'cancelled' && (
                              <button
                                onClick={() => updateStatus(apt.id, 'cancelled')}
                                className="rounded-lg bg-red-100 p-2 text-red-600 hover:bg-red-200"
                                title="Cancel"
                              >
                                <XCircle className="h-4 w-4" />
                              </button>
                            )}
                            <button
                              onClick={() => setSelectedAppointment(apt)}
                              className="rounded-lg bg-gray-100 p-2 text-gray-600 hover:bg-gray-200"
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => deleteAppointment(apt.id)}
                              className="rounded-lg bg-red-100 p-2 text-red-600 hover:bg-red-200"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {selectedAppointment && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedAppointment(null)}
        >
          <div
            className="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-6 text-2xl font-bold text-gray-900">Appointment Details</h2>

            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-semibold text-gray-700">Patient Name</p>
                  <p className="text-gray-900">{selectedAppointment.patientName}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">Email</p>
                  <p className="text-gray-900">{selectedAppointment.patientEmail}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">Phone</p>
                  <p className="text-gray-900">{selectedAppointment.patientPhone}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">Service</p>
                  <p className="text-gray-900">{selectedAppointment.service.name}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">Doctor</p>
                  <p className="text-gray-900">
                    Dr. {selectedAppointment.doctor.firstName}{' '}
                    {selectedAppointment.doctor.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">Price</p>
                  <p className="text-gray-900">${selectedAppointment.service.price}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">Date</p>
                  <p className="text-gray-900">
                    {new Date(selectedAppointment.appointmentDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">Time</p>
                  <p className="text-gray-900">{selectedAppointment.appointmentTime}</p>
                </div>
              </div>

              {selectedAppointment.notes && (
                <div>
                  <p className="text-sm font-semibold text-gray-700">Notes</p>
                  <p className="text-gray-900">{selectedAppointment.notes}</p>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedAppointment(null)}
              className="mt-6 w-full rounded-lg bg-gray-200 py-3 font-semibold text-gray-700 hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
