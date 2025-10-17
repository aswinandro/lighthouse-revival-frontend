import { type NextRequest, NextResponse } from "next/server"
import { getMembersService, createMemberService } from "@/lib/services/members-service"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const churchId = searchParams.get("churchId") || "1"

    const members = await getMembersService(Number.parseInt(churchId))
    return NextResponse.json({ success: true, data: members })
  } catch (error) {
    console.error("Error fetching members:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch members" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const member = await createMemberService(body)
    return NextResponse.json({ success: true, data: member }, { status: 201 })
  } catch (error) {
    console.error("Error creating member:", error)
    return NextResponse.json({ success: false, error: "Failed to create member" }, { status: 500 })
  }
}
