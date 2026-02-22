"use client"

import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import axios from "axios"
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Cell
} from "recharts"
import {
    Eye, MousePointerClick, TrendingUp, Link2, Instagram, Facebook,
    Twitter, Youtube, MessageCircle, Globe, Linkedin, ChevronRight,
    RefreshCw
} from "lucide-react"
import PagesList from "@/components/common/pagesList"
import { CircularProgress } from "@mui/material"

// ── Source config ──────────────────────────────────────────────────────────────
const SOURCE_META = {
    instagram: { label: "Instagram", color: "#E1306C", gradient: "from-pink-500 to-rose-500", Icon: Instagram },
    facebook: { label: "Facebook", color: "#1877F2", gradient: "from-blue-500 to-blue-600", Icon: Facebook },
    twitter: { label: "X / Twitter", color: "#14171A", gradient: "from-gray-700 to-gray-900", Icon: Twitter },
    whatsapp: { label: "WhatsApp", color: "#25D366", gradient: "from-green-400 to-emerald-500", Icon: MessageCircle },
    youtube: { label: "YouTube", color: "#FF0000", gradient: "from-red-500 to-red-600", Icon: Youtube },
    linkedin: { label: "LinkedIn", color: "#0A66C2", gradient: "from-blue-600 to-blue-700", Icon: Linkedin },
    direct: { label: "Direct", color: "#6366f1", gradient: "from-indigo-400 to-purple-500", Icon: Globe },
    other: { label: "Other", color: "#94a3b8", gradient: "from-slate-400 to-slate-500", Icon: Globe },
}

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, sub, gradient }) {
    return (
        <div className={`relative overflow-hidden rounded-2xl p-5 text-white shadow-lg bg-gradient-to-br ${gradient}`}>
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full" />
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/5 rounded-full" />
            <div className="relative z-10">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-3">
                    <Icon size={20} />
                </div>
                <p className="text-white/70 text-xs font-medium uppercase tracking-wider">{label}</p>
                <p className="text-3xl font-bold mt-1">{value}</p>
                {sub && <p className="text-white/60 text-xs mt-1">{sub}</p>}
            </div>
        </div>
    )
}

// ── Source Row ─────────────────────────────────────────────────────────────────
function SourceRow({ source, count, total }) {
    const meta = SOURCE_META[source] || SOURCE_META.other
    const pct = total > 0 ? Math.round((count / total) * 100) : 0
    const Icon = meta.Icon
    return (
        <div className="flex items-center gap-3 py-2.5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br ${meta.gradient} text-white shrink-0`}>
                <Icon size={15} />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{meta.label}</span>
                    <span className="text-sm font-bold text-gray-900">{count.toLocaleString()}</span>
                </div>
                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full bg-gradient-to-r ${meta.gradient} transition-all duration-700`}
                        style={{ width: `${pct}%` }}
                    />
                </div>
            </div>
            <span className="text-xs text-gray-400 w-8 text-right shrink-0">{pct}%</span>
        </div>
    )
}

// ── Custom Tooltip ─────────────────────────────────────────────────────────────
function ChartTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null
    return (
        <div className="bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-xl text-sm">
            <p className="font-semibold text-gray-700 mb-1">{label}</p>
            {payload.map((p) => (
                <p key={p.dataKey} style={{ color: p.color }} className="font-medium">
                    {p.name}: <span className="font-bold">{p.value}</span>
                </p>
            ))}
        </div>
    )
}

// ── Main Dashboard ─────────────────────────────────────────────────────────────
export default function AnalyticsPage() {
    const username = useSelector((state) => state.auth.user)
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [days, setDays] = useState(30)

    const fetchStats = async (selectedDays = days, isRefresh = false) => {
        if (!username) return
        isRefresh ? setRefreshing(true) : setLoading(true)
        try {
            const { data } = await axios.get(
                `/api/user/analytics/stats?username=${username}&days=${selectedDays}`
            )
            setStats(data)
        } catch (e) {
            console.error("Failed to fetch analytics:", e)
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }

    useEffect(() => { fetchStats() }, [username, days])

    const totalSources = stats?.trafficSources?.reduce((a, s) => a + s.count, 0) || 1

    if (loading) {
        return (
            <div className="flex min-h-screen" style={{ background: "linear-gradient(135deg,#f5f7fa 0%,#e4e9f2 100%)" }}>
                <PagesList />
                <div className="flex-1 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <CircularProgress size={48} sx={{ color: "#6366f1" }} />
                        <p className="text-gray-400 text-sm">Loading analytics...</p>
                    </div>
                </div>
            </div>
        )
    }

    // Show empty state if no data yet
    const hasData = stats && (stats.totalViews > 0 || stats.totalClicks > 0)

    return (
        <div className="flex min-h-screen" style={{ background: "linear-gradient(135deg,#f5f7fa 0%,#e4e9f2 100%)" }}>
            <PagesList />

            <main className="flex-1 overflow-y-auto p-6">
                <div className="max-w-5xl mx-auto space-y-6">

                    {/* ── Header ── */}
                    <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-6 rounded-2xl shadow-lg shadow-indigo-200 flex items-center justify-between">
                        <div>
                            <p className="text-indigo-100 text-sm font-medium">Analytics</p>
                            <h1 className="text-2xl font-bold mt-0.5">Performance Overview</h1>
                            <p className="text-white/60 text-xs mt-1">Track clicks, views & traffic sources</p>
                        </div>
                        <button
                            onClick={() => fetchStats(days, true)}
                            className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center hover:bg-white/30 transition-all"
                            title="Refresh"
                        >
                            <RefreshCw size={18} className={refreshing ? "animate-spin" : ""} />
                        </button>
                    </div>

                    {/* ── Date Range Filter ── */}
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 font-medium mr-1">Period:</span>
                        {[
                            { label: "7 days", value: 7 },
                            { label: "30 days", value: 30 },
                            { label: "90 days", value: 90 },
                            { label: "All time", value: 0 },
                        ].map((opt) => (
                            <button
                                key={opt.value}
                                onClick={() => { setDays(opt.value); fetchStats(opt.value) }}
                                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${days === opt.value
                                        ? "bg-indigo-500 text-white shadow-md shadow-indigo-200"
                                        : "bg-white text-gray-500 border border-gray-200 hover:border-indigo-300"
                                    }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>

                    {/* ── Stat Cards ── */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <StatCard
                            icon={Eye}
                            label="Profile Views"
                            value={(stats?.totalViews || 0).toLocaleString()}
                            sub="total page loads"
                            gradient="from-indigo-500 to-purple-600"
                        />
                        <StatCard
                            icon={MousePointerClick}
                            label="Link Clicks"
                            value={(stats?.totalClicks || 0).toLocaleString()}
                            sub="across all links"
                            gradient="from-pink-500 to-rose-500"
                        />
                        <StatCard
                            icon={TrendingUp}
                            label="Click Rate"
                            value={`${stats?.clickRate || "0.0"}%`}
                            sub="clicks per view"
                            gradient="from-emerald-400 to-teal-500"
                        />
                        <StatCard
                            icon={Link2}
                            label="Top Link"
                            value={stats?.topLink || "–"}
                            sub="most clicked"
                            gradient="from-amber-400 to-orange-500"
                        />
                    </div>

                    {!hasData && (
                        <div className="bg-white rounded-2xl border border-dashed border-indigo-200 p-10 text-center">
                            <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Eye size={32} className="text-indigo-400" />
                            </div>
                            <h3 className="font-bold text-gray-800 text-lg mb-2">No data yet</h3>
                            <p className="text-gray-400 text-sm">
                                Share your profile link — views and clicks will appear here automatically.
                            </p>
                        </div>
                    )}

                    {hasData && (
                        <>
                            {/* ── Views & Clicks Over Time ── */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <h2 className="font-bold text-gray-900 mb-1">Views & Clicks Over Time</h2>
                                <p className="text-gray-400 text-xs mb-5">Daily breakdown for the selected period</p>
                                <ResponsiveContainer width="100%" height={250}>
                                    <LineChart data={stats?.daily || []} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                        <XAxis
                                            dataKey="date"
                                            tick={{ fontSize: 10, fill: "#94a3b8" }}
                                            tickFormatter={(d) => {
                                                const dt = new Date(d)
                                                return `${dt.getDate()}/${dt.getMonth() + 1}`
                                            }}
                                            interval="preserveStartEnd"
                                        />
                                        <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} allowDecimals={false} />
                                        <Tooltip content={<ChartTooltip />} />
                                        <Line type="monotone" dataKey="views" stroke="#6366f1" strokeWidth={2.5} dot={false} name="Views" />
                                        <Line type="monotone" dataKey="clicks" stroke="#ec4899" strokeWidth={2.5} dot={false} name="Clicks" />
                                    </LineChart>
                                </ResponsiveContainer>
                                <div className="flex items-center gap-6 mt-4 justify-center">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-indigo-500" />
                                        <span className="text-xs text-gray-500">Views</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-pink-500" />
                                        <span className="text-xs text-gray-500">Clicks</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* ── Traffic Sources ── */}
                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                    <h2 className="font-bold text-gray-900 mb-1">Traffic Sources</h2>
                                    <p className="text-gray-400 text-xs mb-4">Where your visitors come from</p>

                                    {!stats?.trafficSources?.length ? (
                                        <p className="text-gray-300 text-sm text-center py-8">No source data yet</p>
                                    ) : (
                                        <div className="divide-y divide-gray-50">
                                            {stats.trafficSources.map((s) => (
                                                <SourceRow key={s.source} source={s.source} count={s.count} total={totalSources} />
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* ── Link Performance ── */}
                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                    <h2 className="font-bold text-gray-900 mb-1">Link Performance</h2>
                                    <p className="text-gray-400 text-xs mb-4">Clicks per link, sorted by popularity</p>

                                    {!stats?.topLinks?.length ? (
                                        <p className="text-gray-300 text-sm text-center py-8">No link click data yet</p>
                                    ) : (
                                        <div className="space-y-3">
                                            {stats.topLinks.map((link, i) => {
                                                const maxClicks = stats.topLinks[0]?.clicks || 1
                                                const pct = Math.round((link.clicks / maxClicks) * 100)
                                                const rankColors = ["from-amber-400 to-orange-400", "from-slate-300 to-slate-400", "from-orange-300 to-amber-400"]
                                                return (
                                                    <div key={link.linkId || i} className="group">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <div className="flex items-center gap-2 min-w-0">
                                                                <span className={`w-5 h-5 rounded-full text-[10px] font-bold text-white flex items-center justify-center shrink-0 bg-gradient-to-br ${rankColors[i] || "from-indigo-400 to-purple-400"}`}>
                                                                    {i + 1}
                                                                </span>
                                                                <span className="text-sm font-medium text-gray-700 truncate">{link.title}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1 shrink-0 ml-2">
                                                                <MousePointerClick size={12} className="text-gray-400" />
                                                                <span className="text-sm font-bold text-gray-900">{link.clicks}</span>
                                                            </div>
                                                        </div>
                                                        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden ml-7">
                                                            <div
                                                                className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 transition-all duration-700"
                                                                style={{ width: `${pct}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* ── Source Bar Chart ── */}
                            {stats?.trafficSources?.length > 0 && (
                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                    <h2 className="font-bold text-gray-900 mb-1">Source Comparison</h2>
                                    <p className="text-gray-400 text-xs mb-5">Total events (views + clicks) per traffic source</p>
                                    <ResponsiveContainer width="100%" height={200}>
                                        <BarChart data={stats.trafficSources} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                            <XAxis
                                                dataKey="source"
                                                tick={{ fontSize: 11, fill: "#94a3b8" }}
                                                tickFormatter={(s) => SOURCE_META[s]?.label || s}
                                            />
                                            <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} allowDecimals={false} />
                                            <Tooltip
                                                formatter={(val, _, { payload }) => [val, SOURCE_META[payload?.source]?.label || payload?.source]}
                                                contentStyle={{ borderRadius: 12, border: "1px solid #f1f5f9" }}
                                            />
                                            <Bar dataKey="count" radius={[6, 6, 0, 0]} name="Events">
                                                {stats.trafficSources.map((entry) => (
                                                    <Cell key={entry.source} fill={SOURCE_META[entry.source]?.color || "#94a3b8"} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>
        </div>
    )
}
