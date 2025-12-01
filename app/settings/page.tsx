'use client';

import { useState, useEffect } from 'react';
import { Save, CheckCircle2, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { getSettings, saveSettings, AppSettings } from '@/lib/storage';

export default function SettingsPage() {
    const [settings, setSettings] = useState<AppSettings>({
        teamName: '',
        discordWebhookUrl: ''
    });
    const [isSaved, setIsSaved] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const loadedSettings = await getSettings();
            setSettings(loadedSettings);
        } catch (error) {
            console.error('Failed to load settings', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        await saveSettings(settings);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
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
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">설정</h1>
                <p className="text-slate-500 font-medium">팀 이름과 연동 설정을 관리하세요.</p>
            </header>

            <div className="grid lg:grid-cols-2 gap-8">
                <div className="space-y-8">
                    <section>
                        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs">1</span>
                            기본 설정
                        </h2>
                        <Card className="space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">팀 이름</label>
                                <input
                                    type="text"
                                    value={settings.teamName}
                                    onChange={(e) => setSettings({ ...settings, teamName: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 transition-all"
                                    placeholder="예: 1조 (최강1조)"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">디스코드 웹훅 URL (선택)</label>
                                <input
                                    type="text"
                                    value={settings.discordWebhookUrl}
                                    onChange={(e) => setSettings({ ...settings, discordWebhookUrl: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 transition-all"
                                    placeholder="https://discord.com/api/webhooks/..."
                                />
                                <p className="text-xs text-slate-400 mt-2">
                                    * 웹훅 URL이 있으면 회의록과 보고서를 버튼 하나로 전송할 수 있습니다.
                                </p>
                            </div>

                            <div className="pt-2">
                                <Button onClick={handleSave} fullWidth size="lg">
                                    {isSaved ? <CheckCircle2 className="w-5 h-5 mr-2" /> : <Save className="w-5 h-5 mr-2" />}
                                    {isSaved ? '저장되었습니다!' : '설정 저장하기'}
                                </Button>
                            </div>
                        </Card>
                    </section>
                </div>
            </div>
        </div>
    );
}
