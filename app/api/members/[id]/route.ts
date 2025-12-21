import { type NextRequest, NextResponse } from "next/server"
import { getMemberService, updateMemberService, deleteMemberService } from "@/lib/services/members-service"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const member = await getMemberService(params.id, 1)
    return NextResponse.json({ success: true, data: member })
  } catch (error) {
    console.error("Error fetching member:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch member" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const member = await updateMemberService(params.id, body)
    return NextResponse.json({ success: true, data: member })
  } catch (error) {
    console.error("Error updating member:", error)
    return NextResponse.json({ success: false, error: "Failed to update member" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await deleteMemberService(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting member:", error)
    return NextResponse.json({ success: false, error: "Failed to delete member" }, { status: 500 })
  }
}
