import { type NextRequest, NextResponse } from "next/server"
import { getPrayerRequestsService, createPrayerRequestService } from "@/lib/services/prayer-requests-service"

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const churchId = searchParams.get("churchId") || "1"

    const requests = await getPrayerRequestsService(Number.parseInt(churchId))
    return NextResponse.json({ success: true, data: requests })
  } catch (error) {
    console.error("Error fetching prayer requests:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch prayer requests" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const request_data = await createPrayerRequestService(body)
    return NextResponse.json({ success: true, data: request_data }, { status: 201 })
  } catch (error) {
    console.error("Error creating prayer request:", error)
    return NextResponse.json({ success: false, error: "Failed to create prayer request" }, { status: 500 })
  }
}
