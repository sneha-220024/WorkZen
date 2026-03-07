import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar.jsx';
import Button from '../components/common/Button.jsx';

// ── Card image imports ────────────────────────────────
import dashboardImg from '../assets/images/firstcardimage.png';
import attendanceImg from '../assets/images/secondcardimage.png';
import analyticsImg from '../assets/images/thirdcardimage.png';
import payslipImg from '../assets/images/fourthcardimage.png';
import assistantImg from '../assets/images/fifthcardimage.png';

// ── Feature data ──────────────────────────────────────
const features = [
    {
        id: 1,
        image: dashboardImg,
        tag: 'Dashboard',
        tagColor: 'bg-primary/10 text-primary',
        title: 'Unified HR Command Centre',
        description: "Get a bird's-eye view of your entire workforce — headcount, attendance rate, pending leaves, and payroll summary all in one glance.",
        accent: '#4F46E5',
        span: 'col-span-1 md:col-span-2',
    },
    {
        id: 2,
        image: attendanceImg,
        tag: 'Attendance',
        tagColor: 'bg-secondary/10 text-secondary-dark',
        title: 'Real-Time Attendance Tracking',
        description: "One-click check-in & check-out with automatic work-hour calculation. See who's present, absent, late, or working — live.",
        accent: '#14B8A6',
        span: 'col-span-1',
    },
    {
        id: 3,
        image: analyticsImg,
        tag: 'Analytics',
        tagColor: 'bg-accent/10 text-accent',
        title: 'Smart Attendance Analytics',
        description: "Interactive daily and monthly charts with punctuality scores and trend analysis to drive data-backed HR decisions.",
        accent: '#8B5CF6',
        span: 'col-span-1',
    },
    {
        id: 4,
        image: payslipImg,
        tag: 'Payroll',
        tagColor: 'bg-primary/10 text-primary',
        title: 'Automated Payslip Generation',
        description: "Run monthly payroll in seconds. Preview, approve, and download professional PDF payslips for every employee — instantly.",
        accent: '#4F46E5',
        span: 'col-span-1 md:col-span-2',
    },
    {
        id: 5,
        image: assistantImg,
        tag: 'AI Assistant',
        tagColor: 'bg-emerald-100 text-emerald-700',
        title: 'WorkZen AI HR Assistant',
        description: "Ask anything — leave balances, attendance, payroll queries. Your always-available AI teammate handles HR FAQs so you don't have to.",
        accent: '#10B981',
        span: 'col-span-1',
    },
];

// ── How-it-works steps ────────────────────────────────
const steps = [
    {
        step: '01',
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
            </svg>
        ),
        title: 'Set Up Your Workspace',
        desc: 'Create your organisation, invite employees, and assign roles in under 5 minutes.',
    },
    {
        step: '02',
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
            </svg>
        ),
        title: 'Track Daily Operations',
        desc: 'Employees clock in/out, apply leaves, and view schedules — all from their dashboard.',
    },
    {
        step: '03',
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <line x1="2" y1="10" x2="22" y2="10" />
            </svg>
        ),
        title: 'Run Payroll & Download Payslips',
        desc: 'Auto-calculate salaries with deductions and overtime. Generate PDF payslips with one click.',
    },
];

// ── Stats ─────────────────────────────────────────────
const stats = [
    { value: '10K+', label: 'Active Employees' },
    { value: '500+', label: 'Companies Trust Us' },
    { value: '99.9%', label: 'Uptime SLA' },
    { value: '4.9★', label: 'User Rating' },
];

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-background font-inter overflow-x-hidden">
            <Navbar />

            {/* ───────── HERO ───────── */}
            <HeroSection />

            {/* ───────── STATS BAR ───────── */}
            <StatsBar />

            {/* ───────── FEATURES ───────── */}
            <FeaturesSection />

            {/* ───────── HOW IT WORKS ───────── */}
            <HowItWorksSection />

            {/* ───────── CTA BANNER ───────── */}
            <CTABanner />

            {/* ───────── FOOTER ───────── */}
            <Footer />
        </div>
    );
}

/* ════════════════════════════════════════════════════ */
/*  HERO SECTION                                         */
/* ════════════════════════════════════════════════════ */
function HeroSection() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-hero-gradient pt-20">
            {/* Decorative orbs */}
            <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
            <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full bg-secondary/10 blur-[120px] pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-accent/5 blur-[160px] pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 text-center">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/8 border border-primary/20 text-primary text-sm font-medium mb-6 animate-fade-in">
                    <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                    HR Platform built for modern teams
                </div>

                {/* Headline */}
                <h1 className="font-sora font-extrabold text-5xl md:text-6xl lg:text-7xl text-text-primary leading-[1.1] mb-6 animate-slide-up">
                    Manage Your People,{' '}
                    <span className="text-gradient block">Effortlessly.</span>
                </h1>

                {/* Subtext */}
                <p className="font-inter text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in">
                    WorkZen is the all-in-one HR platform — from employee onboarding and attendance tracking
                    to automated payroll and AI-powered HR assistance.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                    <Link to="/register">
                        <Button variant="primary" size="lg" className="min-w-[180px]">
                            Start for Free →
                        </Button>
                    </Link>
                    <Link to="/login">
                        <Button variant="outline" size="lg" className="min-w-[180px]">
                            Sign In
                        </Button>
                    </Link>
                </div>

                {/* Floating stat badges */}
                <div className="flex flex-wrap justify-center gap-4">
                    {[
                        { icon: '👥', text: '10,000+ Employees Managed' },
                        { icon: '⚡', text: 'Real-time Attendance' },
                        { icon: '🤖', text: 'AI-Powered HR Assistant' },
                    ].map((badge) => (
                        <div
                            key={badge.text}
                            className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-full shadow-card border border-border-color text-sm font-medium text-text-secondary"
                        >
                            <span>{badge.icon}</span>
                            <span>{badge.text}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Hero dashboard preview */}
            <div className="relative z-10 max-w-6xl mx-auto px-6 pb-20">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border-color/50">
                    {/* Browser chrome */}
                    <div className="bg-white border-b border-border-color flex items-center gap-2 px-4 py-3">
                        <div className="flex gap-1.5">
                            <span className="w-3 h-3 rounded-full bg-red-400" />
                            <span className="w-3 h-3 rounded-full bg-yellow-400" />
                            <span className="w-3 h-3 rounded-full bg-green-400" />
                        </div>
                        <div className="flex-1 mx-4">
                            <div className="bg-background rounded-md px-3 py-1 text-xs text-text-secondary text-center max-w-xs mx-auto">
                                app.workzen.io/dashboard
                            </div>
                        </div>
                    </div>
                    {/* Dashboard image */}
                    <img
                        src={dashboardImg}
                        alt="WorkZen Dashboard"
                        className="w-full object-cover"
                    />
                    {/* Gradient overlay at bottom */}
                    <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background/80 to-transparent" />
                </div>
            </div>
        </section>
    );
}

/* ════════════════════════════════════════════════════ */
/*  STATS BAR                                            */
/* ════════════════════════════════════════════════════ */
function StatsBar() {
    return (
        <section className="bg-white border-y border-border-color py-10">
            <div className="max-w-5xl mx-auto px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    {stats.map((s) => (
                        <div key={s.label} className="flex flex-col gap-1">
                            <span className="font-sora font-extrabold text-3xl text-text-primary">{s.value}</span>
                            <span className="font-inter text-sm text-text-secondary">{s.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ════════════════════════════════════════════════════ */
/*  FEATURES SECTION                                     */
/* ════════════════════════════════════════════════════ */
function FeaturesSection() {
    return (
        <section id="features" className="py-24 bg-background">
            <div className="max-w-7xl mx-auto px-6">
                {/* Section header */}
                <div className="text-center mb-20">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/8 border border-primary/20 text-primary text-xs font-semibold tracking-wide uppercase mb-4">
                        Everything You Need
                    </div>
                    <h2 className="font-sora font-bold text-4xl md:text-5xl text-text-primary mb-4">
                        One Platform,{' '}
                        <span className="text-gradient">Infinite Possibilities</span>
                    </h2>
                    <p className="font-inter text-text-secondary max-w-xl mx-auto text-lg">
                        From hiring to payroll, WorkZen brings every HR workflow into a single, beautiful interface.
                    </p>
                </div>

                {/* Feature rows */}
                <div className="flex flex-col gap-24">
                    {features.map((feature, index) => (
                        <FeatureCard key={feature.id} feature={feature} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function FeatureCard({ feature, index }) {
    // Alternate sides: even index = text left, odd index = text right
    const isEven = index % 2 === 0;

    return (
        <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-center">
            {/* Text Content */}
            <div className={`flex-1 space-y-6 order-2 ${isEven ? 'md:order-1' : 'md:order-2'}`}>
                <div className="inline-block">
                    <span className={`px-4 py-2 rounded-full text-sm font-bold tracking-wide ${feature.tagColor}`}>
                        {feature.tag}
                    </span>
                </div>
                <h3 className="font-sora font-extrabold text-3xl md:text-4xl text-text-primary leading-[1.2]">
                    {feature.title}
                </h3>
                <p className="font-inter text-lg text-text-secondary leading-relaxed">
                    {feature.description}
                </p>
                <div className="pt-2">
                    <button
                        className="inline-flex items-center gap-2 text-base font-bold transition-colors hover:opacity-80"
                        style={{ color: feature.accent }}
                    >
                        Explore feature
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Image */}
            <div className={`flex-1 w-full order-1 ${isEven ? 'md:order-2' : 'md:order-1'}`}>
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-border-color/60 bg-white group">
                    <img
                        src={feature.image}
                        alt={feature.title}
                        className="w-full h-auto object-cover object-top group-hover:scale-[1.03] transition-transform duration-700"
                    />
                    {/* Subtle gradient overlay at bottom for polish */}
                    <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/5 to-transparent mix-blend-multiply pointer-events-none" />
                </div>
            </div>
        </div>
    );
}

/* ════════════════════════════════════════════════════ */
/*  HOW IT WORKS                                         */
/* ════════════════════════════════════════════════════ */
function HowItWorksSection() {
    return (
        <section id="how-it-works" className="py-24 bg-white">
            <div className="max-w-6xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/10 border border-secondary/30 text-secondary-dark text-xs font-semibold tracking-wide uppercase mb-4">
                        Simple Process
                    </div>
                    <h2 className="font-sora font-bold text-4xl md:text-5xl text-text-primary mb-4">
                        Up & Running in <span className="text-gradient">3 Easy Steps</span>
                    </h2>
                    <p className="font-inter text-text-secondary max-w-xl mx-auto">
                        No complex setup. No IT team required. WorkZen is designed to get you productive on day one.
                    </p>
                </div>

                {/* Steps */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                    {/* Connector line */}
                    <div className="hidden md:block absolute top-10 left-[calc(33.33%+16px)] right-[calc(33.33%+16px)] h-0.5 bg-gradient-to-r from-primary via-accent to-secondary" />

                    {steps.map((step, idx) => (
                        <div key={step.step} className="flex flex-col items-center text-center group">
                            {/* Icon circle */}
                            <div
                                className="relative w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-card group-hover:scale-105 transition-transform"
                                style={{
                                    background: idx === 0
                                        ? 'linear-gradient(135deg, #EEF2FF, #E0E7FF)'
                                        : idx === 1
                                            ? 'linear-gradient(135deg, #F0FDFA, #CCFBF1)'
                                            : 'linear-gradient(135deg, #FAF5FF, #EDE9FE)',
                                }}
                            >
                                <span
                                    style={{
                                        color: idx === 0 ? '#4F46E5' : idx === 1 ? '#14B8A6' : '#8B5CF6',
                                    }}
                                >
                                    {step.icon}
                                </span>
                                {/* Step number badge */}
                                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-text-primary text-white text-xs font-bold flex items-center justify-center">
                                    {idx + 1}
                                </span>
                            </div>
                            <h3 className="font-sora font-semibold text-lg text-text-primary mb-2">{step.title}</h3>
                            <p className="font-inter text-sm text-text-secondary leading-relaxed max-w-xs">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ════════════════════════════════════════════════════ */
/*  CTA BANNER                                           */
/* ════════════════════════════════════════════════════ */
function CTABanner() {
    return (
        <section id="about" className="py-24 px-6">
            <div className="max-w-5xl mx-auto">
                <div className="relative rounded-3xl overflow-hidden bg-primary p-12 md:p-16 text-center">
                    {/* Background decoration */}
                    <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-white/5 blur-2xl pointer-events-none" />
                    <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-secondary/20 blur-2xl pointer-events-none" />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(139,92,246,0.3),transparent_60%)]" />

                    <div className="relative z-10">
                        <span className="inline-block px-3 py-1.5 rounded-full bg-white/15 text-white text-xs font-semibold tracking-wider uppercase mb-4">
                            Get Started Today
                        </span>
                        <h2 className="font-sora font-extrabold text-4xl md:text-5xl text-white mb-4 leading-tight">
                            Ready to Transform<br />Your HR Operations?
                        </h2>
                        <p className="font-inter text-white/75 text-lg max-w-xl mx-auto mb-8">
                            Join hundreds of companies using WorkZen to simplify employee management, automate payroll, and empower their HR teams.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/register">
                                <button className="px-8 py-4 rounded-[10px] bg-white text-primary font-semibold text-base hover:bg-gray-50 transition-colors shadow-lg hover:shadow-xl active:scale-95">
                                    Start Free → No credit card needed
                                </button>
                            </Link>
                            <Link to="/login">
                                <button className="px-8 py-4 rounded-[10px] bg-white/15 text-white font-semibold text-base border border-white/30 hover:bg-white/20 transition-colors">
                                    Sign In to Your Account
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ════════════════════════════════════════════════════ */
/*  FOOTER                                               */
/* ════════════════════════════════════════════════════ */
function Footer() {
    const footerLinks = {
        Product: ['Features', 'Payroll', 'Attendance', 'Analytics'],
        Company: ['About', 'Blog', 'Careers', 'Press'],
        Support: ['Help Center', 'Contact', 'Status', 'Security'],
        Legal: ['Privacy', 'Terms', 'Cookies'],
    };

    return (
        <footer className="bg-text-primary text-white">
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-1">
                        <div className="flex items-center gap-2.5 mb-4">
                            <div className="w-8 h-8 rounded-[8px] bg-primary flex items-center justify-center">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <polyline points="9 22 9 12 15 12 15 22" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <span className="font-sora font-bold text-lg">Work<span className="text-primary-light">Zen</span></span>
                        </div>
                        <p className="font-inter text-sm text-white/50 leading-relaxed max-w-xs">
                            Modern HR management for modern teams.
                        </p>
                    </div>

                    {/* Link columns */}
                    {Object.entries(footerLinks).map(([category, links]) => (
                        <div key={category}>
                            <h4 className="font-sora font-semibold text-sm text-white/80 mb-4 tracking-wide uppercase">{category}</h4>
                            <ul className="space-y-3">
                                {links.map((link) => (
                                    <li key={link}>
                                        <a href="#" className="font-inter text-sm text-white/40 hover:text-white transition-colors">
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom bar */}
                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="font-inter text-sm text-white/40">
                        © 2026 WorkZen. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4">
                        {/* GitHub */}
                        <a href="#" className="text-white/40 hover:text-white transition-colors">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                            </svg>
                        </a>
                        {/* Twitter */}
                        <a href="#" className="text-white/40 hover:text-white transition-colors">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                        </a>
                        {/* LinkedIn */}
                        <a href="#" className="text-white/40 hover:text-white transition-colors">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
