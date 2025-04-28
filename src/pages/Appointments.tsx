

import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, MapPin, Phone, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AppointmentsPage() {
  return (
    <div className="container px-4 py-8 mx-auto max-w-5xl">
      <header className="flex items-center mb-8">
        <Link to="/" className="mr-4">
          <Button variant="ghost" size="icon" className="h-10 w-10">
            <ArrowLeft className="h-6 w-6" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Appointments</h1>
      </header>

      <div className="flex justify-end mb-6">
        <Button size="lg" className="text-lg gap-2">
          <Plus className="h-5 w-5" />
          <span>Schedule Appointment</span>
        </Button>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Upcoming Appointments</h2>
      <div className="space-y-6 mb-8">
        <AppointmentCard
          doctor="Dr. Sarah Johnson"
          specialty="Endocrinologist"
          date="May 15, 2025"
          time="10:30 AM"
          location="Diabetes Care Center"
          address="123 Medical Plaza, Suite 456"
          phone="(555) 123-4567"
        />

        <AppointmentCard
          doctor="Dr. Michael Chen"
          specialty="Ophthalmologist"
          date="June 3, 2025"
          time="2:15 PM"
          location="Vision Care Specialists"
          address="789 Health Avenue, Suite 101"
          phone="(555) 987-6543"
        />
      </div>

      <h2 className="text-2xl font-semibold mb-4">Past Appointments</h2>
      <div className="space-y-6">
        <AppointmentCard
          doctor="Dr. Sarah Johnson"
          specialty="Endocrinologist"
          date="February 15, 2025"
          time="10:30 AM"
          location="Diabetes Care Center"
          address="123 Medical Plaza, Suite 456"
          phone="(555) 123-4567"
          isPast={true}
        />

        <AppointmentCard
          doctor="Dr. Robert Williams"
          specialty="Podiatrist"
          date="January 22, 2025"
          time="3:45 PM"
          location="Foot Health Clinic"
          address="456 Wellness Road"
          phone="(555) 234-5678"
          isPast={true}
        />
      </div>
    </div>
  )
}

function AppointmentCard({
  doctor,
  specialty,
  date,
  time,
  location,
  address,
  phone,
  isPast = false,
}: {
  doctor: string
  specialty: string
  date: string
  time: string
  location: string
  address: string
  phone: string
  isPast?: boolean
}) {
  return (
    <Card className={isPast ? "opacity-70" : ""}>
      <CardHeader>
        <CardTitle className="text-xl">
          {doctor} - {specialty}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <span className="text-lg">{date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <span className="text-lg">{time}</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-lg">{location}</p>
                <p className="text-muted-foreground">{address}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <span className="text-lg">{phone}</span>
            </div>
          </div>
        </div>

        {!isPast && (
          <div className="flex flex-wrap gap-3 pt-2">
            <Button size="lg" className="text-lg">
              Reschedule
            </Button>
            <Button size="lg" variant="outline" className="text-lg">
              Cancel
            </Button>
            <Button size="lg" variant="outline" className="text-lg">
              Get Directions
            </Button>
          </div>
        )}

        {isPast && (
          <div className="flex flex-wrap gap-3 pt-2">
            <Button size="lg" className="text-lg">
              View Notes
            </Button>
            <Button size="lg" variant="outline" className="text-lg">
              Schedule Follow-up
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
