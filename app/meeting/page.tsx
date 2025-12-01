'use client';

import { useState, useEffect } from 'react';
import { Calendar, Copy, Send, Check, AlertCircle, Sparkles, Loader2, Wand2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Member, Meeting, AttendanceRecord } from '@/lib/types';
import { getMembers, getSettings, updateMemberStatus } from '@/lib/storage';
import { generateMeetingMinutes } from '@/lib/templates';
import { sendToDiscord } from '@/lib/discord';

export default function MeetingPage() {
    const [members, setMembers] = useState<Member[]>([]);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [records, setRecords] = useState<AttendanceRecord[]>([]);
    const [teamName, setTeamName] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // Freeform notes state
    const [notes, setNotes] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const [generatedMinutes, setGeneratedMinutes] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [loadedMembers, loadedSettings] = await Promise.all([
                getMembers(),
                getSettings()
            ]);
            const activeMembers = loadedMembers.filter(m => m.status === 'ALIVE');
            setMembers(activeMembers);
            setTeamName(loadedSettings.teamName);
            setRecords(activeMembers.map(m => ({
                memberId: m.id,
                status: 'PRESENT'
            })));
        } catch (error) {
            console.error('Failed to load data', error);
        } finally {
            setIsLoading(false);
        }
    };

    const updateRecord = (memberId: string, status: AttendanceRecord['status']) => {
        setRecords(records.map(r => r.memberId === memberId ? { ...r, status } : r));
    };

    const handleSmartOrganize = async () => {
        if (!notes.trim()) {
            alert('회의 내용을 먼저 입력해주세요!');
            return;
        }

        setIsGenerating(true);
        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ notes }),
            });

            const data = await response.json();

            if (response.ok) {
                setNotes(data.result); // Replace notes with organized content
            } else {
                alert(data.error || '정리 중 오류가 발생했습니다.');
            }
        } catch (error) {
            console.error('AI Generate Error:', error);
            alert('AI 서버와 통신 중 오류가 발생했습니다.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleGenerate = () => {
        const meeting: Meeting = {
            id: 'temp',
            date,
            records
        };
        // Pass the notes directly (whether raw or organized)
        const minutes = generateMeetingMinutes(meeting, members, teamName, notes);
        setGeneratedMinutes(minutes);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedMinutes);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    };

    const handleSend = async () => {
        const settings = await getSettings();
        if (!settings.discordWebhookUrl) {
            alert('설정 페이지에서 디스코드 웹훅 URL을 먼저 등록해주세요!');
            return;
        }

        setIsSending(true);
        const success = await sendToDiscord(settings.discordWebhookUrl, generatedMinutes);
        setIsSending(false);

        if (success) {
            alert('디스코드에 성공적으로 전송되었습니다!');
        } else {
            alert('전송 실패. 웹훅 URL을 확인해주세요.');
        }
    };

    const handleFinalize = async () => {
        if (!confirm('출석 결과를 확정하시겠습니까?')) return;

        const updates = records
            .filter(r => r.status === 'ABSENT')
            .map(async (r) => {
                const member = members.find(m => m.id === r.memberId);
                if (member) {
                    const newAbsentCount = member.absentCount + 1;
                    await updateMemberStatus(member.id, {
                        absentCount: newAbsentCount
                    });
                }
            });

        await Promise.all(updates);

        alert('출석 처리가 완료되었습니다.');
        loadData();
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">모임 관리 & 회의록</h1>
                <p className="text-slate-500 font-medium">출석을 체크하고 회의 내용을 자유롭게 적으세요. AI가 정리해드립니다.</p>
            </header>

            <div className="grid lg:grid-cols-12 gap-8">
                {/* Left Column: Inputs (7 cols) */}
                <div className="lg:col-span-7 space-y-8">
                    {/* 1. Attendance */}
                    <section>
                        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs">1</span>
                            출석 체크
                        </h2>
                        <Card>
                            <div className="mb-6">
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">모임 날짜</label>
                                <div className="relative">
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-800 font-medium transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                {members.map(member => {
                                    const record = records.find(r => r.memberId === member.id);
                                    if (!record) return null;

                                    return (
                                        <div key={member.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                                            <span className="font-bold text-slate-700 ml-2">{member.name}</span>
                                            <div className="flex gap-1 bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
                                                {[
                                                    { val: 'PRESENT', label: '출석', activeClass: 'bg-green-500 text-white shadow-md' },
                                                    { val: 'LATE', label: '지각', activeClass: 'bg-yellow-500 text-white shadow-md' },
                                                    { val: 'ABSENT', label: '결석', activeClass: 'bg-red-500 text-white shadow-md' },
                                                ].map((opt) => (
                                                    <button
                                                        key={opt.val}
                                                        onClick={() => updateRecord(member.id, opt.val as any)}
                                                        className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all duration-200 ${record.status === opt.val
                                                            ? opt.activeClass
                                                            : 'text-slate-400 hover:bg-slate-50'
                                                            }`}
                                                    >
                                                        {opt.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </Card>
                    </section>

                    {/* 2. Meeting Content */}
                    <section>
                        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs">2</span>
                            회의 내용 (자유 입력)
                        </h2>
                        <Card className="space-y-4">
                            <div className="relative">
                                <textarea
                                    placeholder="회의 내용을 자유롭게 적어주세요.&#13;&#10;예: 오늘 회식은 강남역에서 하기로 결정함. 철수가 예약 담당. 다음 주 과제는 API 설계."
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 h-64 resize-none transition-all placeholder-slate-400 leading-relaxed"
                                />
                                <div className="absolute bottom-4 right-4">
                                    <Button
                                        onClick={handleSmartOrganize}
                                        size="sm"
                                        variant="secondary"
                                        isLoading={isGenerating}
                                        className="bg-white/80 backdrop-blur-sm shadow-sm border border-indigo-100 text-indigo-600 hover:bg-indigo-50"
                                    >
                                        <Wand2 className="w-4 h-4 mr-2" />
                                        AI 스마트 정리
                                    </Button>
                                </div>
                            </div>

                            <Button onClick={handleGenerate} fullWidth size="lg" className="group">
                                <Sparkles className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                                회의록 생성하기
                            </Button>
                        </Card>
                    </section>
                </div>

                {/* Right Column: Preview (5 cols) */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="sticky top-8">
                        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs">3</span>
                            미리보기
                        </h2>
                        <Card className="flex flex-col min-h-[1000px] border-indigo-100 shadow-lg shadow-indigo-50/50">
                            {generatedMinutes ? (
                                <>
                                    <div className="flex-1 bg-slate-50 rounded-xl p-4 mb-4 border border-slate-100">
                                        <textarea
                                            value={generatedMinutes}
                                            onChange={(e) => setGeneratedMinutes(e.target.value)}
                                            className="w-full h-full bg-transparent border-none outline-none resize-none font-mono text-sm text-slate-700 leading-relaxed"
                                        />
                                    </div>
                                    <div className="flex gap-3">
                                        <Button onClick={handleCopy} variant="secondary" className="flex-1">
                                            {copySuccess ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                                            {copySuccess ? '복사됨!' : '복사하기'}
                                        </Button>
                                        <Button onClick={handleSend} className="flex-1" isLoading={isSending}>
                                            <Send className="w-4 h-4 mr-2" />
                                            전송
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center text-slate-300">
                                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                        <Sparkles className="w-8 h-8 text-slate-300" />
                                    </div>
                                    <p className="text-center font-medium">왼쪽에서 내용을 입력하고<br />'회의록 생성하기'를 눌러주세요.</p>
                                </div>
                            )}
                        </Card>

                        {generatedMinutes && (
                            <div className="mt-6 bg-white border border-red-100 rounded-2xl p-5 shadow-sm">
                                <div className="flex items-start gap-4">
                                    <div className="bg-red-50 p-2 rounded-lg shrink-0">
                                        <AlertCircle className="w-5 h-5 text-red-500" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 text-sm mb-1">마무리 단계</h4>
                                        <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                                            회의록 전송이 끝났다면, 반드시 아래 버튼을 눌러 출석 결과를 저장해주세요.
                                        </p>
                                        <Button onClick={handleFinalize} variant="danger" size="sm" fullWidth>
                                            출석 결과 확정 및 저장
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
