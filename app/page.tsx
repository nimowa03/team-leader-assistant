'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle2, UserPlus, MoreHorizontal, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Member, getMembers, addMember, updateMemberStatus, deleteMember, getSettings } from '@/lib/storage';

export default function Dashboard() {
  const [members, setMembers] = useState<Member[]>([]);
  const [newMemberName, setNewMemberName] = useState('');
  const [teamName, setTeamName] = useState('우리 조');
  const [todayTask, setTodayTask] = useState<{ title: string, desc: string } | null>(null);
  const [currentDate, setCurrentDate] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
    setCurrentDate(new Date().toLocaleDateString());
    checkTodayTask();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [loadedMembers, loadedSettings] = await Promise.all([
        getMembers(),
        getSettings()
      ]);
      setMembers(loadedMembers);
      setTeamName(loadedSettings.teamName);
    } catch (error) {
      console.error('Failed to load data', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkTodayTask = () => {
    const day = new Date().getDay();
    if (day === 0) {
      setTodayTask({ title: '🔥 과제 마감일', desc: '오후 9시 마감입니다. 미제출 인원을 확인하고 독려해주세요!' });
    } else if (day === 1) {
      setTodayTask({ title: '📅 한 주 시작', desc: '이번 주 모임 일정을 잡으셨나요?' });
    } else {
      setTodayTask({ title: '✨ 즐거운 하루', desc: '조원들과 소통하며 활기찬 하루 보내세요!' });
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;

    const tempName = newMemberName;
    setNewMemberName(''); // Clear input immediately for better UX

    const newMember = await addMember(tempName.trim());
    if (newMember) {
      setMembers(prev => [...prev, newMember]);
    } else {
      alert('멤버 추가 실패');
      setNewMemberName(tempName); // Restore input on failure
    }
  };

  const handleDeleteMember = async (id: string) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      await deleteMember(id);
      setMembers(members.filter(m => m.id !== id));
    }
  };

  const toggleStatus = async (member: Member) => {
    const newStatus = member.status === 'ALIVE' ? 'ELIMINATED' : 'ALIVE';
    // Optimistic update
    setMembers(members.map(m => m.id === member.id ? { ...m, status: newStatus } : m));
    await updateMemberStatus(member.id, { status: newStatus });
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
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">
            안녕하세요, 조장님! 👋
          </h1>
          <p className="text-slate-500 font-medium">
            <span className="text-indigo-600 font-bold">{teamName}</span>의 현황을 한눈에 확인하세요.
          </p>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-sm text-slate-400 font-medium">{currentDate}</p>
        </div>
      </header>

      {/* Today's Task Widget */}
      {todayTask && (
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-1 shadow-lg shadow-indigo-200">
          <div className="bg-white rounded-xl p-6 flex items-start space-x-5">
            <div className="bg-indigo-50 p-3 rounded-2xl shrink-0">
              <CheckCircle2 className="w-8 h-8 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-bold text-xl text-slate-900 mb-1">{todayTask.title}</h3>
              <p className="text-slate-600 leading-relaxed">{todayTask.desc}</p>
            </div>
          </div>
        </div>
      )}

      {/* Member Management Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-indigo-500" />
            조원 관리
            <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-full ml-2">
              {members.length}명
            </span>
          </h2>
        </div>

        {/* Add Member Input */}
        <Card className="bg-slate-50/50 border-dashed border-2 border-slate-200" noPadding>
          <form onSubmit={handleAddMember} className="flex p-2">
            <input
              type="text"
              value={newMemberName}
              onChange={(e) => setNewMemberName(e.target.value)}
              placeholder="새로운 조원의 이름을 입력하고 엔터를 누르세요..."
              className="flex-1 px-6 py-4 bg-transparent border-none focus:ring-0 text-lg placeholder-slate-400 text-slate-800"
            />
            <Button type="submit" disabled={!newMemberName.trim()} size="lg" className="shrink-0 rounded-xl">
              <Plus className="w-5 h-5 mr-2" />
              추가
            </Button>
          </form>
        </Card>

        {/* Member Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {members.length === 0 ? (
            <div className="col-span-full text-center py-20">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserPlus className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-500 font-medium">아직 등록된 조원이 없습니다.<br />위 입력창에서 첫 번째 조원을 추가해보세요!</p>
            </div>
          ) : (
            members.map((member) => (
              <div
                key={member.id}
                className="group relative bg-white border border-slate-100 rounded-2xl p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleDeleteMember(member.id)}
                    className="text-slate-300 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex flex-col items-center text-center mb-4">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold mb-3 shadow-sm ${member.status === 'ALIVE'
                    ? 'bg-gradient-to-br from-indigo-50 to-white text-indigo-600 border border-indigo-100'
                    : 'bg-slate-50 text-slate-400 border border-slate-100 grayscale'
                    }`}>
                    {member.name[0]}
                  </div>
                  <h3 className="font-bold text-lg text-slate-900">{member.name}</h3>
                  <div className="mt-2">
                    <StatusBadge status={member.status} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 bg-slate-50 rounded-xl p-3 mb-4">
                  <div className="text-center">
                    <p className="text-xs text-slate-500 mb-1">결석</p>
                    <p className={`font-bold ${member.absentCount > 0 ? 'text-red-500' : 'text-slate-700'}`}>
                      {member.absentCount}
                    </p>
                  </div>
                  <div className="text-center border-l border-slate-200">
                    <p className="text-xs text-slate-500 mb-1">미제출</p>
                    <p className={`font-bold ${member.missedAssignmentCount > 0 ? 'text-red-500' : 'text-slate-700'}`}>
                      {member.missedAssignmentCount}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => toggleStatus(member)}
                  className="w-full py-2 text-xs font-medium text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors flex items-center justify-center gap-1"
                >
                  <MoreHorizontal className="w-3 h-3" />
                  상태 변경
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
