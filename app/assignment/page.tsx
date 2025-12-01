'use client';

import { useState, useEffect } from 'react';
import { Copy, Send, Check, AlertCircle, X, Sparkles, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Member, Assignment, AssignmentRecord } from '@/lib/types';
import { getMembers, getSettings, updateMemberStatus } from '@/lib/storage';
import { generateAssignmentNotice } from '@/lib/templates';
import { sendToDiscord } from '@/lib/discord';

export default function AssignmentPage() {
    const [members, setMembers] = useState<Member[]>([]);
    const [records, setRecords] = useState<AssignmentRecord[]>([]);
    const [teamName, setTeamName] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const [generatedNotice, setGeneratedNotice] = useState('');
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
                status: 'NOT_SUBMITTED'
            })));
        } catch (error) {
            console.error('Failed to load data', error);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleStatus = (memberId: string) => {
        setRecords(records.map(r =>
            r.memberId === memberId
                ? { ...r, status: r.status === 'SUBMITTED' ? 'NOT_SUBMITTED' : 'SUBMITTED' }
                : r
        ));
    };

    const handleGenerate = () => {
        const assignment: Assignment = {
            id: 'temp',
            weekLabel: '이번 주',
            deadline: '',
            records
        };
        const notice = generateAssignmentNotice(assignment, members, teamName);
        setGeneratedNotice(notice);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedNotice);
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
        const success = await sendToDiscord(settings.discordWebhookUrl, generatedNotice);
        setIsSending(false);

        if (success) {
            alert('디스코드에 성공적으로 전송되었습니다!');
        } else {
            alert('전송 실패. 웹훅 URL을 확인해주세요.');
        }
    };

    const handleFinalize = async () => {
        if (!confirm('과제 결과를 확정하시겠습니까?')) return;

        const updates = records
            .filter(r => r.status === 'NOT_SUBMITTED')
            .map(async (r) => {
                const member = members.find(m => m.id === r.memberId);
                if (member) {
                    const newMissedCount = member.missedAssignmentCount + 1;
                    await updateMemberStatus(member.id, {
                        missedAssignmentCount: newMissedCount
                    });
                }
            });

        await Promise.all(updates);

        alert('과제 결과가 처리되었습니다.');
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
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">과제 관리</h1>
                <p className="text-slate-500 font-medium">제출 현황을 체크하고 독려 메시지를 보내세요.</p>
            </header>

            <div className="grid lg:grid-cols-12 gap-8">
                {/* Left Column: Checklist (7 cols) */}
                <div className="lg:col-span-7 space-y-6">
                    <Card title="제출 현황 체크" className="min-h-[500px]">
                        <div className="grid gap-3 mb-8">
                            {members.map(member => {
                                const record = records.find(r => r.memberId === member.id);
                                if (!record) return null;
                                const isSubmitted = record.status === 'SUBMITTED';

                                return (
                                    <div
                                        key={member.id}
                                        onClick={() => toggleStatus(member.id)}
                                        className={`group flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all duration-200 border-2 ${isSubmitted
                                            ? 'bg-indigo-50 border-indigo-500 shadow-md shadow-indigo-100'
                                            : 'bg-white border-slate-100 hover:border-indigo-200 hover:shadow-sm'
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-300 ${isSubmitted ? 'bg-indigo-500 text-white shadow-sm' : 'bg-slate-100 text-slate-300 group-hover:bg-slate-200'
                                                }`}>
                                                {isSubmitted ? <Check className="w-6 h-6" /> : <X className="w-5 h-5" />}
                                            </div>
                                            <span className={`text-lg font-bold transition-colors ${isSubmitted ? 'text-indigo-900' : 'text-slate-500 group-hover:text-slate-700'
                                                }`}>
                                                {member.name}
                                            </span>
                                        </div>
                                        <span className={`text-xs font-bold px-3 py-1.5 rounded-full transition-colors ${isSubmitted ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-400'
                                            }`}>
                                            {isSubmitted ? '제출완료' : '미제출'}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        <Button onClick={handleGenerate} fullWidth size="lg" className="group">
                            <Sparkles className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                            보고서 생성하기
                        </Button>
                    </Card>
                </div>

                {/* Right Column: Preview (5 cols) */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="sticky top-8">
                        <Card title="보고서 미리보기" className="flex flex-col min-h-[800px] border-indigo-100 shadow-lg shadow-indigo-50/50">
                            {generatedNotice ? (
                                <>
                                    <div className="flex-1 bg-slate-50 rounded-xl p-4 mb-4 border border-slate-100">
                                        <textarea
                                            value={generatedNotice}
                                            onChange={(e) => setGeneratedNotice(e.target.value)}
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
                                    <p className="text-center font-medium">왼쪽에서 제출 여부를 체크하고<br />'보고서 생성하기'를 눌러주세요.</p>
                                </div>
                            )}
                        </Card>

                        {generatedNotice && (
                            <div className="mt-6 bg-white border border-red-100 rounded-2xl p-5 shadow-sm">
                                <div className="flex items-start gap-4">
                                    <div className="bg-red-50 p-2 rounded-lg shrink-0">
                                        <AlertCircle className="w-5 h-5 text-red-500" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 text-sm mb-1">마무리 단계</h4>
                                        <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                                            일요일 마감 후에는 반드시 아래 버튼을 눌러 미제출자를 시스템에 반영해주세요.
                                        </p>
                                        <Button onClick={handleFinalize} variant="danger" size="sm" fullWidth>
                                            과제 결과 확정 및 저장
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
