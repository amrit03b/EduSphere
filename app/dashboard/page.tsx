"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Brain,
  Upload,
  FileText,
  LogOut,
  ChevronDown,
  Plus,
  Home,
  BookOpen,
  Search,
  Lightbulb,
  FileVideo,
  CreditCard,
} from "lucide-react"
import { useAuth } from "../../contexts/AuthContext"
import { useRouter, useSearchParams } from "next/navigation"
import SyllabusUploader from "../../components/SyllabusUploader"
import ChapterBreakdown from "../../components/ChapterBreakdown"
import { db } from "../../firebase/config"
import { collection, query, where, getDocs, orderBy } from "firebase/firestore"

export default function DashboardPage() {
  const { user, loading, logout } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [syllabuses, setSyllabuses] = useState<any[]>([])
  const [syllabusLoading, setSyllabusLoading] = useState(false)
  const [syllabusError, setSyllabusError] = useState("")
  const [refresh, setRefresh] = useState(0)
  const [breakdowns, setBreakdowns] = useState<any[]>([])
  const [selectedBreakdown, setSelectedBreakdown] = useState<any | null>(null)
  const [loadingBreakdowns, setLoadingBreakdowns] = useState(false)
  const [breakdownError, setBreakdownError] = useState("")

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  const handleLogout = async () => {
    try {
      await logout()
      router.push("/")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const fetchSyllabuses = async (uid: string) => {
    setSyllabusLoading(true)
    setSyllabusError("")
    try {
      const q = query(
        collection(db, "syllabuses"),
        where("userId", "==", uid),
        orderBy("createdAt", "desc")
      )
      const querySnapshot = await getDocs(q)
      setSyllabuses(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
    } catch (err: any) {
      setSyllabusError(err.message || "Failed to fetch syllabuses.")
    } finally {
      setSyllabusLoading(false)
    }
  }

  useEffect(() => {
    if (!loading && user) {
      fetchSyllabuses(user.uid)
    }
  }, [user, loading, refresh])

  // Fetch all syllabusBreakdowns for the user
  const fetchBreakdowns = async (uid: string) => {
    setLoadingBreakdowns(true)
    setBreakdownError("")
    try {
      const q = query(
        collection(db, "syllabusBreakdowns"),
        where("userId", "==", uid),
        orderBy("createdAt", "desc")
      )
      const querySnapshot = await getDocs(q)
      const docs = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      console.log('Fetched breakdowns:', docs)
      setBreakdowns(docs)
      if (docs.length > 0) {
        console.log('Setting selected breakdown:', docs[0])
        setSelectedBreakdown(docs[0])
      } else {
        setSelectedBreakdown(null)
      }
    } catch (err: any) {
      console.error(err);
      setBreakdownError(err.message || "Failed to fetch past chats.")
    } finally {
      setLoadingBreakdowns(false)
    }
  }

  useEffect(() => {
    if (!loading && user) {
      fetchBreakdowns(user.uid)
    }
  }, [user, loading, refresh])

  // Handle URL parameter for specific chat
  useEffect(() => {
    if (breakdowns.length > 0) {
      const chatId = searchParams.get('chat')
      if (chatId) {
        const targetBreakdown = breakdowns.find(b => b.id === chatId)
        if (targetBreakdown) {
          setSelectedBreakdown(targetBreakdown)
        }
      } else if (breakdowns.length > 0 && !selectedBreakdown) {
        setSelectedBreakdown(breakdowns[0])
      }
    }
  }, [breakdowns, searchParams, selectedBreakdown])

  // Debug logging for selectedBreakdown
  useEffect(() => {
    if (selectedBreakdown) {
      console.log('Selected breakdown:', selectedBreakdown)
      console.log('Breakdown chapters:', selectedBreakdown.breakdown)
    }
  }, [selectedBreakdown])

  if (loading) return <div>Loading...</div>
  if (!user) return null

  // const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0]
  //   if (file) {
  //     setSelectedFile(file)
  //   }
  // }

  // const handleDragOver = (e: React.DragEvent) => {
  //   e.preventDefault()
  // }

  // const handleDrop = (e: React.DragEvent) => {
  //   e.preventDefault()
  //   const file = e.dataTransfer.files[0]
  //   if (file) {
  //     setSelectedFile(file)
  //   }
  // }

  // Get user display name or fallback to email
  const displayName = user?.displayName || user?.email?.split("@")[0] || "User";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Pass a callback to SyllabusUploader to trigger refresh after upload
  const handleSyllabusUploaded = () => setRefresh((r) => r + 1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-blossom-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur border-b border-blossom-200 shadow-sm sticky top-0 z-40">
        <div className="flex items-center justify-between px-8 py-4">
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 bg-gradient-to-r from-blossom-500 to-rose-500 rounded-lg flex items-center justify-center logo-animation pink-glow">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-extrabold brand-text-animation tracking-tight">
              <span className="pink-gradient-text">Edu</span><span className="text-gray-800">Sphere</span>
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl hover:bg-blossom-50 transition-all duration-300"
              >
                <div className="w-9 h-9 bg-gradient-to-r from-blossom-500 to-rose-500 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-white text-base font-bold">{initials}</span>
                </div>
                <span className="text-gray-800 font-semibold">{displayName}</span>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-blossom-200 py-2 animate-fade-in">
                  <div className="px-4 py-3 border-b border-blossom-100">
                    <p className="text-sm font-semibold text-gray-900">{displayName}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-blossom-50 transition-all duration-200 flex items-center"
                  >
                    <LogOut className="w-4 h-4 inline mr-2" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar: Past Chats */}
        <aside className="w-72 bg-slate-100 border-r border-slate-200 min-h-screen flex flex-col shadow-sm">
          <div className="p-6 border-b border-slate-200">
            <h3 className="text-md font-bold text-slate-700 mb-4 tracking-tight">Past Chats</h3>
            {loadingBreakdowns ? (
              <div className="text-slate-400">Loading...</div>
            ) : breakdownError ? (
              <div className="text-red-600">{breakdownError}</div>
            ) : breakdowns.length === 0 ? (
              <div className="text-slate-400">No past chats yet.</div>
            ) : (
              <ul className="space-y-2">
                {breakdowns.map((b) => (
                  <li key={b.id}>
                    <button
                      className={`w-full text-left px-3 py-2 rounded-lg font-semibold transition-colors shadow-sm ${selectedBreakdown?.id === b.id ? "bg-blue-100 text-blue-700" : "hover:bg-slate-200 text-slate-700"}`}
                      onClick={() => setSelectedBreakdown(b)}
                    >
                      <div className="truncate font-bold text-base">{b.title}</div>
                      <div className="text-xs text-slate-500 truncate">{b.createdAt?.toDate?.().toLocaleString?.() || ""}</div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
        </aside>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-8 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="mb-12">
              <h1 className="text-4xl font-extrabold text-gray-900 mb-4 animate-fade-in">
                Welcome back, {displayName}!
              </h1>
              <p className="text-xl text-gray-600 animate-fade-in animation-delay-100">
                Let's continue your learning journey
              </p>
            </div>

            <div className="space-y-8">
              {/* Syllabus Upload Section */}
              <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 animate-fade-in animation-delay-200 border border-blossom-100">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blossom-500 to-rose-500 rounded-lg flex items-center justify-center shadow-md">
                    <Upload className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Upload Your Syllabus</h2>
                    <p className="text-gray-600">Share your syllabus to get started with personalized learning</p>
                  </div>
                </div>
                <SyllabusUploader onSyllabusUploaded={handleSyllabusUploaded} />
              </div>

              {/* Chapter Breakdown */}
              {selectedBreakdown ? (
                <div className="bg-white rounded-2xl shadow-lg p-8 animate-fade-in animation-delay-300 border border-blossom-100">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-blossom-500 to-rose-500 rounded-lg flex items-center justify-center shadow-md">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Chapter Breakdown</h2>
                      <p className="text-gray-600">Explore your syllabus chapter by chapter</p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900">
                      {selectedBreakdown.title || "Syllabus"}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {selectedBreakdown.createdAt?.toDate?.().toLocaleString?.() || ""}
                    </p>
                  </div>
                  <ChapterBreakdown 
                    chapters={selectedBreakdown.breakdown} 
                    key={selectedBreakdown.id}
                    chatId={selectedBreakdown.id}
                    chatTitle={selectedBreakdown.title || "Untitled Chat"}
                  />
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-md">
                  <BookOpen className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-slate-800 mb-2">No Syllabus Selected</h3>
                  <p className="text-slate-600 mb-4">Select a past chat or upload a new syllabus to get started.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
