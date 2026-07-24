"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import {
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Briefcase,
  Search,
  Users,
  Brain,
  Bookmark,
  BookOpen,
  FileText,
  Save,
  Building2,
} from "lucide-react"
import { updateProfile, type ProfileData } from "@/app/actions/profile"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ROLE_LABELS } from "@/lib/nav"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

const USER_TYPES = [
  { value: "student", label: "Student", icon: GraduationCap },
  { value: "graduate", label: "Graduate", icon: Briefcase },
  { value: "job_seeker", label: "Job seeker", icon: Search },
  { value: "counsellor", label: "Counsellor", icon: Users },
]

const DISTRICTS = [
  "Western Area Urban (Freetown)",
  "Western Area Rural",
  "Bo",
  "Bombali",
  "Bonthe",
  "Falaba",
  "Kailahun",
  "Kambia",
  "Karene",
  "Kenema",
  "Koinadugu",
  "Kono",
  "Moyamba",
  "Port Loko",
  "Pujehun",
  "Tonkolili",
]

const EDUCATION_LEVELS = [
  "Secondary / WASSCE",
  "Technical / Vocational Certificate",
  "Diploma / HND",
  "Bachelor's Degree",
  "Master's Degree",
  "Doctorate (PhD)",
  "Other",
]

const selectClass =
  "flex h-10 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30"

export function ProfileClient({
  data,
  stats,
}: {
  data: ProfileData
  stats: {
    personalityType: string | null
    savedCareers: number
    coursesTracked: number
    hasResume: boolean
  }
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const isAdmin = data.role === "admin"

  const [name, setName] = useState(data.name)
  const [role, setRole] = useState(data.role)
  const [headline, setHeadline] = useState(data.profile?.headline ?? "")
  const [phone, setPhone] = useState(data.profile?.phone ?? "")
  const [district, setDistrict] = useState(data.profile?.district ?? "")
  const [educationLevel, setEducationLevel] = useState(data.profile?.educationLevel ?? "")
  const [fieldOfStudy, setFieldOfStudy] = useState(data.profile?.fieldOfStudy ?? "")
  const [institution, setInstitution] = useState(data.profile?.institution ?? "")
  const [bio, setBio] = useState(data.profile?.bio ?? "")
  const [interests, setInterests] = useState(data.profile?.interests ?? "")

  const initials =
    name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "U"

  const handleSave = () => {
    if (name.trim().length < 2) {
      toast.error("Please enter your full name")
      return
    }
    startTransition(async () => {
      try {
        await updateProfile({
          name: name.trim(),
          role: isAdmin ? undefined : role,
          headline,
          phone,
          district,
          educationLevel,
          fieldOfStudy,
          institution,
          bio,
          interests,
        })
        toast.success("Profile saved successfully")
        router.refresh()
      } catch (err: any) {
        toast.error(err?.message || "Failed to save profile")
      }
    })
  }

  return (
    <div className="container max-w-4xl space-y-8 p-4 py-8 md:p-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1 rounded-full px-3 py-1">
            <User className="h-3.5 w-3.5 text-primary" />
            Your Profile
          </Badge>
        </div>
        <h1 className="mt-2 font-serif text-3xl font-bold tracking-tight">Manage your profile</h1>
        <p className="mt-1 text-muted-foreground">
          Keep your details up to date so we can tailor career guidance to your background in Sierra Leone.
        </p>
      </div>

      {/* Identity + stats */}
      <Card>
        <CardContent className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center">
          <Avatar className="h-20 w-20">
            <AvatarFallback className="bg-primary/10 text-2xl font-semibold text-primary">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <h2 className="font-serif text-2xl font-bold">{name || "Your name"}</h2>
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Mail className="h-3.5 w-3.5" />
              {data.email}
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <Badge variant="outline" className="border-primary/30 text-primary">
                {ROLE_LABELS[role] ?? "Member"}
              </Badge>
              {district && (
                <Badge variant="secondary" className="gap-1">
                  <MapPin className="h-3 w-3" />
                  {district}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity snapshot */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">RIASEC Profile</CardTitle>
            <Brain className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="font-serif text-xl font-bold text-primary">
              {stats.personalityType ?? "Not taken"}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saved Careers</CardTitle>
            <Bookmark className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="font-serif text-xl font-bold">{stats.savedCareers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Courses Tracked</CardTitle>
            <BookOpen className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="font-serif text-xl font-bold">{stats.coursesTracked}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resume</CardTitle>
            <FileText className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="font-serif text-xl font-bold">{stats.hasResume ? "Analyzed" : "None yet"}</div>
          </CardContent>
        </Card>
      </div>

      {/* Account details */}
      <Card>
        <CardHeader>
          <CardTitle>Account details</CardTitle>
          <CardDescription>Your name and how you use CareerAI Sierra Leone</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Aminata Kamara" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={data.email} disabled readOnly />
              <p className="text-xs text-muted-foreground">Email cannot be changed</p>
            </div>
          </div>

          {isAdmin ? (
            <div className="flex flex-col gap-2">
              <Label>Role</Label>
              <Badge variant="outline" className="w-fit border-primary/30 text-primary">
                Administrator
              </Badge>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Label>I am a...</Label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {USER_TYPES.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setRole(t.value)}
                    className={cn(
                      "flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm transition-colors",
                      role === t.value
                        ? "border-primary bg-primary/5 text-foreground"
                        : "border-border text-muted-foreground hover:bg-muted",
                    )}
                  >
                    <t.icon className="h-4 w-4" />
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Profile details */}
      <Card>
        <CardHeader>
          <CardTitle>Profile details</CardTitle>
          <CardDescription>Help us personalize your career recommendations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="headline">Professional headline</Label>
            <Input
              id="headline"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Aspiring Data Analyst | Statistics Graduate"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="phone" className="flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5" /> Phone number
              </Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+232 76 000 000"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="district" className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" /> District
              </Label>
              <select
                id="district"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className={selectClass}
              >
                <option value="">Select district</option>
                {DISTRICTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="education" className="flex items-center gap-1.5">
                <GraduationCap className="h-3.5 w-3.5" /> Highest education
              </Label>
              <select
                id="education"
                value={educationLevel}
                onChange={(e) => setEducationLevel(e.target.value)}
                className={selectClass}
              >
                <option value="">Select level</option>
                {EDUCATION_LEVELS.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="field">Field of study</Label>
              <Input
                id="field"
                value={fieldOfStudy}
                onChange={(e) => setFieldOfStudy(e.target.value)}
                placeholder="e.g. Statistics & Economics"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="institution" className="flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5" /> Institution
            </Label>
            <Input
              id="institution"
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              placeholder="e.g. Fourah Bay College, University of Sierra Leone"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="interests">Career interests</Label>
            <Input
              id="interests"
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              placeholder="e.g. Data analysis, public health, agribusiness"
            />
            <p className="text-xs text-muted-foreground">Separate interests with commas</p>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="bio">About you</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Write a short summary about your background, goals, and what you're looking for..."
              className="min-h-[120px] leading-relaxed"
              maxLength={1000}
            />
            <p className="text-xs text-muted-foreground">{bio.length}/1000 characters</p>
          </div>
        </CardContent>
      </Card>

      {/* Save bar */}
      <div className="flex items-center justify-end gap-3">
        <Button onClick={handleSave} disabled={isPending} size="lg">
          <Save className="mr-2 h-4 w-4" />
          {isPending ? "Saving..." : "Save profile"}
        </Button>
      </div>
    </div>
  )
}
