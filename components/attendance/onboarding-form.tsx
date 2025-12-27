"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { CalendarIcon, User, MapPin, Heart, Briefcase, Church } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

const onboardingSchema = z.object({
    firstName: z.string().min(1, "First Name is required"),
    lastName: z.string().min(1, "Last Name is required"),
    gender: z.string().min(1, "Gender is required"),
    dateOfBirth: z.string().min(1, "Date of Birth is required"),
    phone: z.string(),
    email: z.string().email("Invalid email").optional().or(z.literal("")),
    address: z.string().optional(),
    city: z.string().min(1, "City is required"),
    country: z.string().default("UAE"),
    maritalStatus: z.string().optional(),
    occupation: z.string().optional(),
    baptismDate: z.string().optional(),
    baptismLocation: z.string().optional(),
    heardFrom: z.string().optional(),
})

interface OnboardingFormProps {
    phone: string
    onSubmit: (data: z.infer<typeof onboardingSchema>) => void
    onCancel: () => void
}

export function OnboardingForm({ phone, onSubmit, onCancel }: OnboardingFormProps) {
    const form = useForm<z.infer<typeof onboardingSchema>>({
        resolver: zodResolver(onboardingSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            phone: phone,
            email: "",
            country: "UAE",
            city: "Dubai",
        },
    })

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                {/* Identity Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-primary">
                        <User className="h-5 w-5" />
                        <h3 className="font-semibold text-lg">Identity</h3>
                    </div>
                    <Card className="bg-card border-muted/40 shadow-sm">
                        <CardContent className="p-4 grid gap-4">
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="firstName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>First Name <span className="text-red-500">*</span></FormLabel>
                                            <FormControl>
                                                <Input placeholder="John" {...field} className="bg-background" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="lastName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Last Name <span className="text-red-500">*</span></FormLabel>
                                            <FormControl>
                                                <Input placeholder="Doe" {...field} className="bg-background" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="gender"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Gender <span className="text-red-500">*</span></FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="bg-background">
                                                        <SelectValue placeholder="Select" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="Male">Male</SelectItem>
                                                    <SelectItem value="Female">Female</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="dateOfBirth"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Date of Birth <span className="text-red-500">*</span></FormLabel>
                                            <FormControl>
                                                <Input type="date" {...field} className="bg-background block w-full" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Contact Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-primary">
                        <MapPin className="h-5 w-5" />
                        <h3 className="font-semibold text-lg">Contact</h3>
                    </div>
                    <Card className="bg-card border-muted/40 shadow-sm">
                        <CardContent className="p-4 grid gap-4">
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone Number</FormLabel>
                                        <FormControl>
                                            <Input {...field} disabled className="bg-muted text-muted-foreground" />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="john@example.com" {...field} className="bg-background" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Address</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Apartment, Street" {...field} className="bg-background" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="city"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>City <span className="text-red-500">*</span></FormLabel>
                                            <FormControl>
                                                <Input placeholder="Dubai" {...field} className="bg-background" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="country"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Country</FormLabel>
                                            <FormControl>
                                                <Input placeholder="UAE" {...field} className="bg-background" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Other Details */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-primary">
                        <Briefcase className="h-5 w-5" />
                        <h3 className="font-semibold text-lg">Other Details</h3>
                    </div>
                    <Card className="bg-card border-muted/40 shadow-sm">
                        <CardContent className="p-4 grid gap-4">
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="maritalStatus"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Marital Status</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="bg-background">
                                                        <SelectValue placeholder="Select" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="Single">Single</SelectItem>
                                                    <SelectItem value="Married">Married</SelectItem>
                                                    <SelectItem value="Divorced">Divorced</SelectItem>
                                                    <SelectItem value="Widowed">Widowed</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="occupation"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Occupation</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Engineer, Teacher..." {...field} className="bg-background" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Spiritual Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-primary">
                        <Church className="h-5 w-5" />
                        <h3 className="font-semibold text-lg">Spiritual Life</h3>
                    </div>
                    <Card className="bg-card border-muted/40 shadow-sm">
                        <CardContent className="p-4 grid gap-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="baptismDate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Baptism Date (If applicable)</FormLabel>
                                            <FormControl>
                                                <Input type="date" {...field} className="bg-background block w-full" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="baptismLocation"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Baptism Location</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Church Name, City" {...field} className="bg-background" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="heardFrom"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>How did you hear about us?</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="bg-background">
                                                    <SelectValue placeholder="Select option" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Friend">Friend / Family</SelectItem>
                                                <SelectItem value="Social Media">Social Media</SelectItem>
                                                <SelectItem value="Website">Website</SelectItem>
                                                <SelectItem value="Event">Event</SelectItem>
                                                <SelectItem value="Other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>
                </div>

                <div className="flex gap-3 pt-4 sticky bottom-0 bg-background/95 backdrop-blur py-4 z-10 border-t border-border mt-6">
                    <Button type="button" variant="ghost" className="flex-1" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button type="submit" className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg">
                        Complete Registration
                    </Button>
                </div>
            </form>
        </Form>
    )
}
