"use client";

import axios from "axios";
import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface ReelConfig {
  trigger_keyword: string;
  dm_message: string;
  comment_reply: string;
  active: boolean;
}

interface Reel {
  id: string;
  thumbnail_url: string;
  permalink?: string;
  caption: string;
  media_type: string;
  config: ReelConfig;
}

interface Stats {
  total_reels: number;
  configured: number;
  using_default: number;
}

const emptyConfig: ReelConfig = {
  trigger_keyword: "",
  dm_message: "",
  comment_reply: "",
  active: true
};

export default function Dashboard() {
  const [reels, setReels] = useState<Reel[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingReel, setEditingReel] = useState<Reel | null>(null);
  const [formData, setFormData] = useState<ReelConfig>(emptyConfig);

  useEffect(() => {
    void fetchData();
  }, []);

  async function fetchData() {
    try {
      const [reelsResponse, statsResponse] = await Promise.all([
        axios.get(`${API_URL}/api/reels`),
        axios.get(`${API_URL}/api/stats`)
      ]);

      setReels(reelsResponse.data.reels);
      setStats(statsResponse.data);
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    } finally {
      setLoading(false);
    }
  }

  function openEditModal(reel: Reel) {
    setEditingReel(reel);
    setFormData(reel.config);
  }

  function closeModal() {
    setEditingReel(null);
    setFormData(emptyConfig);
    setSaving(false);
  }

  async function handleSave() {
    if (!editingReel) {
      return;
    }

    setSaving(true);
    try {
      await axios.put(`${API_URL}/api/reels/${editingReel.id}`, formData);
      await fetchData();
      closeModal();
    } catch (error) {
      console.error("Failed to save reel config", error);
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="glass rounded-[32px] px-10 py-12 text-center">
          <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-white/20 border-t-white" />
          <p className="mt-5 text-lg tracking-wide text-white/85">Loading your automation dashboard...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-6 md:px-8 md:py-10">
      <div className="mx-auto max-w-7xl">
        <section className="stagger-in rounded-[36px] border border-white/10 bg-black/15 px-6 py-8 md:px-10 md:py-12">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <p className="mb-3 text-sm uppercase tracking-[0.35em] text-white/60">Instagram Growth Engine</p>
              <h1 className="text-4xl font-semibold leading-tight md:text-6xl">
                Turn comments into instant DMs with a dashboard built for your repo.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-white/72 md:text-lg">
                Manage per-reel triggers, DM copy, and comment replies from one place. The backend listens for Meta
                webhook events and fires the configured automation when the keyword matches.
              </p>
            </div>

            <div className="panel rounded-[28px] p-5 md:w-[320px]">
              <p className="text-xs uppercase tracking-[0.3em] text-white/55">Webhook Route</p>
              <p className="mt-3 break-all font-mono text-sm text-white/85">{`${API_URL}/webhook`}</p>
              <p className="mt-4 text-sm text-white/65">Use this URL in your Meta app after deploying the backend.</p>
            </div>
          </div>
        </section>

        {stats && (
          <section className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
              { label: "Total Reels", value: stats.total_reels, tone: "from-orange-500/30 to-pink-500/30" },
              { label: "Configured", value: stats.configured, tone: "from-emerald-500/30 to-teal-500/30" },
              { label: "Using Default", value: stats.using_default, tone: "from-indigo-500/30 to-sky-500/30" }
            ].map((item, index) => (
              <article
                key={item.label}
                className={`stagger-in glass rounded-[28px] bg-gradient-to-br ${item.tone} p-6`}
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <p className="text-sm uppercase tracking-[0.3em] text-white/62">{item.label}</p>
                <p className="mt-4 text-5xl font-semibold">{item.value}</p>
              </article>
            ))}
          </section>
        )}

        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Your Media</h2>
            <p className="text-sm text-white/65">Click any card to edit trigger and response behavior.</p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {reels.map((reel, index) => (
              <button
                key={reel.id}
                type="button"
                onClick={() => openEditModal(reel)}
                className="stagger-in group text-left"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <article className="glass overflow-hidden rounded-[28px] transition duration-300 group-hover:-translate-y-1 group-hover:shadow-2xl">
                  <div className="relative aspect-[4/5] bg-black/30">
                    {reel.thumbnail_url ? (
                      <img src={reel.thumbnail_url} alt={reel.caption || "Instagram media"} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-white/45">No preview available</div>
                    )}
                    <div className="absolute left-3 top-3 rounded-full bg-black/50 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/80">
                      {reel.media_type}
                    </div>
                    <div
                      className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-semibold ${
                        reel.config.active ? "bg-emerald-500 text-white" : "bg-white/20 text-white/85"
                      }`}
                    >
                      {reel.config.active ? "Active" : "Paused"}
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="line-clamp-2 min-h-[3rem] text-sm leading-6 text-white/90">
                      {reel.caption || "No caption"}
                    </p>
                    <div className="mt-4 flex items-center justify-between gap-3 text-xs uppercase tracking-[0.18em] text-white/55">
                      <span>Trigger</span>
                      <span className="truncate rounded-full bg-white/10 px-3 py-1 text-white/84">
                        {reel.config.trigger_keyword || "none"}
                      </span>
                    </div>
                  </div>
                </article>
              </button>
            ))}
          </div>
        </section>

        {editingReel && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={closeModal}>
            <div className="panel w-full max-w-3xl rounded-[32px] p-6 md:p-8" onClick={(event) => event.stopPropagation()}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-white/55">Configure Automation</p>
                  <h3 className="mt-2 text-3xl font-semibold">Edit reel workflow</h3>
                </div>
                <button type="button" onClick={closeModal} className="rounded-full bg-white/10 px-3 py-2 text-sm text-white/75">
                  Close
                </button>
              </div>

              <div className="mt-6 grid gap-5">
                <label className="grid gap-2">
                  <span className="text-sm uppercase tracking-[0.22em] text-white/58">Trigger keyword</span>
                  <input
                    type="text"
                    value={formData.trigger_keyword}
                    onChange={(event) => setFormData({ ...formData, trigger_keyword: event.target.value })}
                    placeholder="info"
                    className="rounded-2xl border border-white/15 bg-white/8 px-4 py-3 text-white outline-none transition focus:border-orange-300"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm uppercase tracking-[0.22em] text-white/58">DM message</span>
                  <textarea
                    value={formData.dm_message}
                    onChange={(event) => setFormData({ ...formData, dm_message: event.target.value })}
                    placeholder="Thanks for your interest. Check your DMs."
                    className="min-h-28 rounded-2xl border border-white/15 bg-white/8 px-4 py-3 text-white outline-none transition focus:border-pink-300"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm uppercase tracking-[0.22em] text-white/58">Comment reply</span>
                  <textarea
                    value={formData.comment_reply}
                    onChange={(event) => setFormData({ ...formData, comment_reply: event.target.value })}
                    placeholder="Sent you a DM."
                    className="min-h-28 rounded-2xl border border-white/15 bg-white/8 px-4 py-3 text-white outline-none transition focus:border-indigo-300"
                  />
                </label>

                <label className="flex items-center gap-3 rounded-2xl border border-white/12 bg-white/6 px-4 py-4">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(event) => setFormData({ ...formData, active: event.target.checked })}
                    className="h-5 w-5"
                  />
                  <span className="text-white/88">Enable automation for this reel</span>
                </label>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => void handleSave()}
                  disabled={saving}
                  className="rounded-2xl bg-gradient-to-r from-orange-500 to-pink-500 px-6 py-4 font-semibold text-white transition hover:brightness-110 disabled:opacity-65"
                >
                  {saving ? "Saving..." : "Save changes"}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-2xl border border-white/14 bg-white/8 px-6 py-4 font-semibold text-white/84"
                >
                  Cancel
                </button>
                {editingReel.permalink && (
                  <a
                    href={editingReel.permalink}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-2xl border border-white/14 bg-transparent px-6 py-4 font-semibold text-white/84"
                  >
                    Open on Instagram
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
