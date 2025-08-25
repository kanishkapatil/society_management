'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

type Booking = {
  id: string;
  amenity: string;
  booking_date: string;
  slot: string;
};

export default function AmenitiesPage() {
  const [amenity, setAmenity] = useState('');
  const [date, setDate] = useState('');
  const [slot, setSlot] = useState('');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [msg, setMsg] = useState('');
  const [userId, setUserId] = useState<string | null>(null);

  const amenitiesList = ['Pool', 'Gym', 'Spa', 'Party Hall', 'Tennis Court'];
  const slots = ['Morning (8-11am)', 'Afternoon (12-3pm)', 'Evening (4-7pm)'];

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUserId(data.user.id);
        fetchBookings(data.user.id);
      }
    });
  }, []);

  const fetchBookings = async (uid: string) => {
    const { data, error } = await supabase
      .from('amenities_bookings')
      .select('*')
      .eq('user_id', uid)
      .order('booking_date', { ascending: true });
    if (error) console.error(error);
    else setBookings(data as Booking[]);
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amenity || !date || !slot || !userId) {
      setMsg('Please select all fields!');
      return;
    }
    const { error } = await supabase.from('amenities_bookings').insert({
      user_id: userId,
      amenity,
      booking_date: date,
      slot,
    });
    if (error) setMsg('Error: ' + error.message);
    else {
      setMsg('Booking successful!');
      setAmenity('');
      setDate('');
      setSlot('');
      fetchBookings(userId);
    }
  };

  const handleCancel = async (id: string) => {
    const { error } = await supabase.from('amenities_bookings').delete().eq('id', id);
    if (error) setMsg('Error: ' + error.message);
    else if (userId) fetchBookings(userId);
  };

  return (
    <div
      className="min-vh-100"
      style={{
        background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        padding: '2rem',
      }}
    >
      <div className="container">
        {/* Header */}
        <div
          className="d-flex justify-content-between align-items-center mb-5 p-4"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '20px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          }}
        >
          <h1
            className="fw-bold mb-0"
            style={{
              background: 'linear-gradient(135deg, #fff, #a0a0a0)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: '2rem',
            }}
          >
            🛠️ Amenities Booking
          </h1>
          <Link
            href="/dashboard"
            className="btn px-4 py-2 fw-bold"
            style={{
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)',
            }}
          >
            ← Dashboard
          </Link>
        </div>

        {/* Booking Form */}
        <div
          className="p-4 mb-5"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '20px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          }}
        >
          <form onSubmit={handleBooking}>
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label text-light">Amenity</label>
                <select
                  className="form-select"
                  value={amenity}
                  onChange={(e) => setAmenity(e.target.value)}
                >
                  <option value="">--Select--</option>
                  {amenitiesList.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label text-light">Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label text-light">Time Slot</label>
                <select
                  className="form-select"
                  value={slot}
                  onChange={(e) => setSlot(e.target.value)}
                >
                  <option value="">--Select--</option>
                  {slots.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
            <button type="submit" className="btn btn-primary mt-3">
              Book Now
            </button>
          </form>
          {msg && <p className="text-success mt-3">{msg}</p>}
        </div>

        {/* Bookings List */}
        {bookings.length > 0 && (
          <div
            className="p-4"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            }}
          >
            <h2 className="h5 text-light mb-3">My Bookings</h2>
            <div className="row g-3">
              {bookings.map((b) => (
                <div key={b.id} className="col-md-6 col-lg-4">
                  <div
                    className="p-3"
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      borderRadius: '12px',
                      border: '1px solid rgba(255,255,255,0.1)',
                    }}
                  >
                    <h5 className="text-light mb-1">{b.amenity}</h5>
                    <p className="text-light opacity-75 mb-1">
                      {b.booking_date} ({b.slot})
                    </p>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleCancel(b.id)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

