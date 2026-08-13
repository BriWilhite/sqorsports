import { NextResponse } from "next/server"

const SUPABASE_URL = "https://pjifexeqrycpmumsuimk.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqaWZleGVxcnljcG11bXN1aW1rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY0ODI4ODEsImV4cCI6MjEwMjA1ODg4MX0.mPXFp4jRp-DwICSFQeveP6KVpIAjCgeWZhwGbqP5o0o"

export async function GET() {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/events?select=*&order=start_time`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        next: { revalidate: 60 },
      }
    )

    const events = await res.json()

    let ics = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//SqorSports//Calendar//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:SqorSports Events
X-WR-TIMEZONE:America/Los_Angeles
`

    if (Array.isArray(events)) {
      events.forEach((event: any) => {
        const start = new Date(event.start_time)
        const end = event.end_time
          ? new Date(event.end_time)
          : new Date(start.getTime() + 60 * 60 * 1000)

        const formatDate = (d: Date) =>
          d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"

        ics += `BEGIN:VEVENT
UID:${event.id}@sqorsports.com
DTSTAMP:${formatDate(new Date())}
DTSTART:${formatDate(start)}
DTEND:${formatDate(end)}
SUMMARY:${(event.title || "Untitled Event").replace(/\n/g, " ")}
DESCRIPTION:${(event.description || "").replace(/\n/g, " ")}
LOCATION:${(event.location || "").replace(/\n/g, " ")}
END:VEVENT
`
      })
    }

    ics += `END:VCALENDAR`

    return new NextResponse(ics, {
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": 'attachment; filename="sqorsports.ics"',
      },
    })
  } catch (error) {
    console.error(error)
    return new NextResponse("Error generating calendar", { status: 500 })
  }
}