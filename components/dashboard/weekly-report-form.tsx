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
import { Calendar, DollarSign, TrendingUp, Users, ClipboardList, Lightbulb, Zap, HelpCircle } from "lucide-react"

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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-[1600px] mx-auto">
            {error && <Alert variant="destructive">{error}</Alert>}
            {success && <Alert className="bg-green-500/10 text-green-500 border-green-500/20">Report submitted successfully!</Alert>}

            {/* Header: Report Period */}
            <Card className="border-primary/20 shadow-sm">
                <CardHeader className="pb-3 px-6 pt-6">
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-primary" />
                        Report Period
                    </CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
                        <div className="space-y-2">
                            <Label htmlFor="report_week_start" className="text-sm font-semibold">Week Start Date</Label>
                            <Input id="report_week_start" type="date" className="h-11" {...register("report_week_start", { required: true })} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="report_week_end" className="text-sm font-semibold">Week End Date</Label>
                            <Input id="report_week_end" type="date" className="h-11" {...register("report_week_end", { required: true })} />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

                {/* Financial Summary card (Integrated Income & Expenses if needed, but let's keep separate cards in a 3-column setup) */}

                {/* Income Section */}
                <Card className="shadow-sm h-full border-none bg-card/50 backdrop-blur-sm">
                    <CardHeader className="border-b pb-4 mb-4">
                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                            <DollarSign className="w-5 h-5 text-green-500" />
                            Income (AED)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="tithe_amount">Tithes</Label>
                                <Input id="tithe_amount" type="number" step="0.01" className="h-10" {...register("tithe_amount")} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="offering_amount">General Offering</Label>
                                <Input id="offering_amount" type="number" step="0.01" className="h-10" {...register("offering_amount")} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="special_offering_amount">Special Offering</Label>
                                <Input id="special_offering_amount" type="number" step="0.01" className="h-10" {...register("special_offering_amount")} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="donations_amount">Donations</Label>
                                <Input id="donations_amount" type="number" step="0.01" className="h-10" {...register("donations_amount")} />
                            </div>
                            <div className="space-y-2 xl:col-span-2">
                                <Label htmlFor="other_income">Other Income</Label>
                                <Input id="other_income" type="number" step="0.01" className="h-10" {...register("other_income")} />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Expenses Section */}
                <Card className="lg:col-span-2 shadow-sm h-full border-none bg-card/50 backdrop-blur-sm">
                    <CardHeader className="border-b pb-4 mb-4">
                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-red-500" />
                            Expenses (AED)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-x-6 gap-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="rent_expense">Rent</Label>
                                <Input id="rent_expense" type="number" step="0.01" className="h-10" {...register("rent_expense")} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="utilities_expense">Utilities</Label>
                                <Input id="utilities_expense" type="number" step="0.01" className="h-10" {...register("utilities_expense")} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="ministry_expense">Ministry</Label>
                                <Input id="ministry_expense" type="number" step="0.01" className="h-10" {...register("ministry_expense")} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="transportation_expense">Transportation</Label>
                                <Input id="transportation_expense" type="number" step="0.01" className="h-10" {...register("transportation_expense")} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="maintenance_expense">Maintenance</Label>
                                <Input id="maintenance_expense" type="number" step="0.01" className="h-10" {...register("maintenance_expense")} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="staff_expense">Staff Expense</Label>
                                <Input id="staff_expense" type="number" step="0.01" className="h-10" {...register("staff_expense")} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="outreach_expense">Outreach</Label>
                                <Input id="outreach_expense" type="number" step="0.01" className="h-10" {...register("outreach_expense")} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="other_expenses">Other Expenses</Label>
                                <Input id="other_expenses" type="number" step="0.01" className="h-10" {...register("other_expenses")} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="expense_notes">Expense Notes</Label>
                            <Input id="expense_notes" className="h-10" {...register("expense_notes")} placeholder="Briefly describe what expenses were for..." />
                        </div>
                    </CardContent>
                </Card>

                {/* Attendance Section */}
                <Card className="shadow-sm border-none bg-card/50 backdrop-blur-sm">
                    <CardHeader className="border-b pb-4 mb-4">
                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                            <Users className="w-5 h-5 text-blue-500" />
                            Attendance
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="sunday_service_attendance">Sunday Service</Label>
                                <Input id="sunday_service_attendance" type="number" className="h-10" {...register("sunday_service_attendance")} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="midweek_service_attendance">Midweek Service</Label>
                                <Input id="midweek_service_attendance" type="number" className="h-10" {...register("midweek_service_attendance")} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="prayer_meeting_attendance">Prayer Meeting</Label>
                                <Input id="prayer_meeting_attendance" type="number" className="h-10" {...register("prayer_meeting_attendance")} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="youth_service_attendance">Youth Service</Label>
                                <Input id="youth_service_attendance" type="number" className="h-10" {...register("youth_service_attendance")} />
                            </div>
                            <div className="space-y-2 xl:col-span-2">
                                <Label htmlFor="children_service_attendance">Children's Service</Label>
                                <Input id="children_service_attendance" type="number" className="h-10" {...register("children_service_attendance")} />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Ministry Statistics */}
                <Card className="lg:col-span-2 shadow-sm border-none bg-card/50 backdrop-blur-sm">
                    <CardHeader className="border-b pb-4 mb-4">
                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                            <Zap className="w-5 h-5 text-purple-500" />
                            Ministry Statistics
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="new_converts">New Converts</Label>
                                <Input id="new_converts" type="number" className="h-10" {...register("new_converts")} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="new_members">New Members</Label>
                                <Input id="new_members" type="number" className="h-10" {...register("new_members")} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="water_baptisms">Water Baptisms</Label>
                                <Input id="water_baptisms" type="number" className="h-10" {...register("water_baptisms")} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="spirit_baptisms">Spirit Baptisms</Label>
                                <Input id="spirit_baptisms" type="number" className="h-10" {...register("spirit_baptisms")} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="home_visits">Home Visits</Label>
                                <Input id="home_visits" type="number" className="h-10" {...register("home_visits")} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="hospital_visits">Hospital Visits</Label>
                                <Input id="hospital_visits" type="number" className="h-10" {...register("hospital_visits")} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="counseling_sessions">Counseling</Label>
                                <Input id="counseling_sessions" type="number" className="h-10" {...register("counseling_sessions")} />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Notes Section - Pulling into a 3 column layout for desktop */}
                <Card className="lg:col-span-3 shadow-sm border-none bg-card/50 backdrop-blur-sm">
                    <CardHeader className="border-b pb-4 mb-4">
                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                            <ClipboardList className="w-5 h-5 text-primary" />
                            Additional Information & Narratives
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="highlights" className="font-semibold">Highlights</Label>
                                <Textarea id="highlights" {...register("highlights")} rows={3} className="resize-none" placeholder="What went well?" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="challenges" className="font-semibold">Challenges</Label>
                                <Textarea id="challenges" {...register("challenges")} rows={3} className="resize-none" placeholder="Any issues?" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="prayer_requests" className="font-semibold">Prayer Requests</Label>
                                <Textarea id="prayer_requests" {...register("prayer_requests")} rows={3} className="resize-none" placeholder="How can we pray?" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="upcoming_events" className="font-semibold">Upcoming Events</Label>
                                <Textarea id="upcoming_events" {...register("upcoming_events")} rows={3} className="resize-none" placeholder="What's next?" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex justify-end gap-4 p-4 bg-muted/30 rounded-lg">
                <Button type="button" variant="outline" size="lg" onClick={() => reset()}>
                    Reset Form
                </Button>
                <Button type="submit" disabled={loading} size="lg" className="px-8">
                    {loading ? "Submitting..." : "Submit Weekly Report"}
                </Button>
            </div>
        </form>
    )
}
