"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { apiClient } from "@/lib/api-client"
import { getToken } from "@/lib/utils"
import { Alert } from "@/components/ui/alert"
import { useChurch } from "@/components/providers/church-context"

interface WeeklyReportFormProps {
    onSuccess?: () => void
}

export function WeeklyReportForm({ onSuccess }: WeeklyReportFormProps) {
    const { selectedChurch } = useChurch()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)

    const { register, handleSubmit, reset } = useForm({
        defaultValues: {
            report_week_start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            report_week_end: new Date().toISOString().split('T')[0],
            tithe_amount: 0,
            offering_amount: 0,
            special_offering_amount: 0,
            donations_amount: 0,
            other_income: 0,
            rent_expense: 0,
            utilities_expense: 0,
            ministry_expense: 0,
            transportation_expense: 0,
            maintenance_expense: 0,
            staff_expense: 0,
            outreach_expense: 0,
            other_expenses: 0,
            expense_notes: "",
            sunday_service_attendance: 0,
            midweek_service_attendance: 0,
            prayer_meeting_attendance: 0,
            youth_service_attendance: 0,
            children_service_attendance: 0,
            new_converts: 0,
            water_baptisms: 0,
            spirit_baptisms: 0,
            home_visits: 0,
            hospital_visits: 0,
            counseling_sessions: 0,
            new_members: 0,
            highlights: "",
            challenges: "",
            prayer_requests: "",
            upcoming_events: ""
        }
    })

    const onSubmit = async (data: any) => {
        setLoading(true)
        setError("")
        setSuccess(false)
        try {
            const token = getToken()
            if (!token) throw new Error("Authentication required")

            const reportData = {
                ...data,
                church_id: selectedChurch?.id === 'all' ? undefined : selectedChurch?.id,
                // Convert numbers
                tithe_amount: parseFloat(data.tithe_amount),
                offering_amount: parseFloat(data.offering_amount),
                special_offering_amount: parseFloat(data.special_offering_amount),
                donations_amount: parseFloat(data.donations_amount),
                other_income: parseFloat(data.other_income),
                rent_expense: parseFloat(data.rent_expense),
                utilities_expense: parseFloat(data.utilities_expense),
                ministry_expense: parseFloat(data.ministry_expense),
                transportation_expense: parseFloat(data.transportation_expense),
                maintenance_expense: parseFloat(data.maintenance_expense),
                staff_expense: parseFloat(data.staff_expense),
                outreach_expense: parseFloat(data.outreach_expense),
                other_expenses: parseFloat(data.other_expenses),
                sunday_service_attendance: parseInt(data.sunday_service_attendance),
                midweek_service_attendance: parseInt(data.midweek_service_attendance),
                prayer_meeting_attendance: parseInt(data.prayer_meeting_attendance),
                youth_service_attendance: parseInt(data.youth_service_attendance),
                children_service_attendance: parseInt(data.children_service_attendance),
                new_converts: parseInt(data.new_converts),
                water_baptisms: parseInt(data.water_baptisms),
                spirit_baptisms: parseInt(data.spirit_baptisms),
                home_visits: parseInt(data.home_visits),
                hospital_visits: parseInt(data.hospital_visits),
                counseling_sessions: parseInt(data.counseling_sessions),
                new_members: parseInt(data.new_members),
            }

            await apiClient.createWeeklyReport(reportData, token)
            setSuccess(true)
            reset()
            if (onSuccess) onSuccess()
        } catch (e: any) {
            console.error(e)
            setError(e.message || "Failed to submit report")
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && <Alert variant="destructive">{error}</Alert>}
            {success && <Alert className="bg-green-500/10 text-green-500 border-green-500/20">Report submitted successfully!</Alert>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Info */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-lg">Report Period</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="report_week_start">Week Start Date</Label>
                            <Input id="report_week_start" type="date" {...register("report_week_start", { required: true })} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="report_week_end">Week End Date</Label>
                            <Input id="report_week_end" type="date" {...register("report_week_end", { required: true })} />
                        </div>
                    </CardContent>
                </Card>

                {/* Income Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Income (AED)</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="tithe_amount">Tithes</Label>
                            <Input id="tithe_amount" type="number" step="0.01" {...register("tithe_amount")} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="offering_amount">General Offering</Label>
                            <Input id="offering_amount" type="number" step="0.01" {...register("offering_amount")} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="special_offering_amount">Special Offering</Label>
                            <Input id="special_offering_amount" type="number" step="0.01" {...register("special_offering_amount")} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="donations_amount">Donations</Label>
                            <Input id="donations_amount" type="number" step="0.01" {...register("donations_amount")} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="other_income">Other Income</Label>
                            <Input id="other_income" type="number" step="0.01" {...register("other_income")} />
                        </div>
                    </CardContent>
                </Card>

                {/* Expenses Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Expenses (AED)</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="rent_expense">Rent</Label>
                            <Input id="rent_expense" type="number" step="0.01" {...register("rent_expense")} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="utilities_expense">Utilities (Water & Elec)</Label>
                            <Input id="utilities_expense" type="number" step="0.01" {...register("utilities_expense")} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="ministry_expense">Ministry Expense</Label>
                            <Input id="ministry_expense" type="number" step="0.01" {...register("ministry_expense")} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="transportation_expense">Transportation</Label>
                            <Input id="transportation_expense" type="number" step="0.01" {...register("transportation_expense")} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="other_expenses">Other Expenses</Label>
                            <Input id="other_expenses" type="number" step="0.01" {...register("other_expenses")} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="expense_notes">Expense Notes</Label>
                            <Textarea id="expense_notes" {...register("expense_notes")} placeholder="Details about expenses..." />
                        </div>
                    </CardContent>
                </Card>

                {/* Attendance Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Service Attendance</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="sunday_service_attendance">Sunday Service</Label>
                            <Input id="sunday_service_attendance" type="number" {...register("sunday_service_attendance")} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="midweek_service_attendance">Midweek Service</Label>
                            <Input id="midweek_service_attendance" type="number" {...register("midweek_service_attendance")} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="youth_service_attendance">Youth Service</Label>
                            <Input id="youth_service_attendance" type="number" {...register("youth_service_attendance")} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="children_service_attendance">Children's Service</Label>
                            <Input id="children_service_attendance" type="number" {...register("children_service_attendance")} />
                        </div>
                    </CardContent>
                </Card>

                {/* Ministry Stats */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Ministry Statistics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="new_converts">New Converts</Label>
                                <Input id="new_converts" type="number" {...register("new_converts")} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="new_members">New Members</Label>
                                <Input id="new_members" type="number" {...register("new_members")} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="water_baptisms">Water Baptisms</Label>
                                <Input id="water_baptisms" type="number" {...register("water_baptisms")} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="home_visits">Home Visits</Label>
                                <Input id="home_visits" type="number" {...register("home_visits")} />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Notes Section */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-lg">Ministry Highlights & Challenges</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="highlights">Highlights</Label>
                            <Textarea id="highlights" {...register("highlights")} rows={3} placeholder="What went well this week?" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="challenges">Challenges</Label>
                            <Textarea id="challenges" {...register("challenges")} rows={3} placeholder="Any difficulties faced?" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="prayer_requests">Prayer Requests</Label>
                            <Textarea id="prayer_requests" {...register("prayer_requests")} rows={3} placeholder="Specific prayer needs for your church..." />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="upcoming_events">Upcoming Events</Label>
                            <Textarea id="upcoming_events" {...register("upcoming_events")} rows={3} placeholder="What's coming up next week?" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => reset()}>
                    Reset Form
                </Button>
                <Button type="submit" disabled={loading}>
                    {loading ? "Submitting..." : "Submit Weekly Report"}
                </Button>
            </div>
        </form>
    )
}
