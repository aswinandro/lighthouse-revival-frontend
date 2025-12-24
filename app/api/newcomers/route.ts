import { type NextRequest, NextResponse } from "next/server"
import { getNewcomersService, createNewcomerService } from "@/lib/services/newcomers-service"

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const churchId = searchParams.get("churchId") || "1"

    const newcomers = await getNewcomersService(Number.parseInt(churchId))
    return NextResponse.json({ success: true, data: newcomers })
  } catch (error) {
    console.error("Error fetching newcomers:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch newcomers" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const newcomer = await createNewcomerService(body)
    return NextResponse.json({ success: true, data: newcomer }, { status: 201 })
  } catch (error) {
    console.error("Error creating newcomer:", error)
    return NextResponse.json({ success: false, error: "Failed to create newcomer" }, { status: 500 })
  }
}
