import { supabase } from './supabase';
import { Member, Meeting, Assignment, AppSettings } from './types';

// --- 멤버 관리 (Members) ---
export const getMembers = async (): Promise<Member[]> => {
    const { data, error } = await supabase
        .from('members')
        .select('*')
        .order('created_at', { ascending: true });

    if (error) {
        console.error('멤버 목록 조회 실패:', error);
        return [];
    }

    // DB 컬럼(snake_case)을 앱 타입(camelCase)으로 변환
    return (data || []).map((m: any) => ({
        id: m.id,
        name: m.name,
        status: m.status,
        absentCount: m.absent_count,
        missedAssignmentCount: m.missed_assignment_count
    }));
};

export const addMember = async (name: string): Promise<Member | null> => {
    const { data, error } = await supabase
        .from('members')
        .insert([{ name, status: 'ALIVE', absent_count: 0, missed_assignment_count: 0 }])
        .select()
        .single();

    if (error) {
        console.error('멤버 추가 실패:', error);
        return null;
    }

    return {
        id: data.id,
        name: data.name,
        status: data.status,
        absentCount: data.absent_count,
        missedAssignmentCount: data.missed_assignment_count
    };
};

export const updateMemberStatus = async (id: string, updates: Partial<Member>) => {
    // 앱 타입(camelCase)을 DB 컬럼(snake_case)으로 변환
    const dbUpdates: any = {};
    if (updates.name) dbUpdates.name = updates.name;
    if (updates.status) dbUpdates.status = updates.status;
    if (updates.absentCount !== undefined) dbUpdates.absent_count = updates.absentCount;
    if (updates.missedAssignmentCount !== undefined) dbUpdates.missed_assignment_count = updates.missedAssignmentCount;

    const { error } = await supabase
        .from('members')
        .update(dbUpdates)
        .eq('id', id);

    if (error) {
        console.error('멤버 정보 수정 실패:', error);
    }
};

export const deleteMember = async (id: string) => {
    const { error } = await supabase
        .from('members')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('멤버 삭제 실패:', error);
    }
};

// --- 설정 관리 (Settings) ---
export const getSettings = async (): Promise<AppSettings> => {
    const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('id', 1)
        .single();

    if (error) {
        // 설정이 없으면(첫 실행 시), 기본값 반환
        return { teamName: '우리 조', discordWebhookUrl: '' };
    }

    return {
        teamName: data.team_name || '우리 조',
        discordWebhookUrl: data.discord_webhook_url || ''
    };
};

export const saveSettings = async (settings: AppSettings) => {
    const { error } = await supabase
        .from('settings')
        .upsert({
            id: 1,
            team_name: settings.teamName,
            discord_webhook_url: settings.discordWebhookUrl
        });

    if (error) {
        console.error('설정 저장 실패:', error);
    }
};

// --- 모임 및 과제 (현재는 로컬 상태로만 관리) ---
// 모임이나 과제 히스토리를 저장하는 테이블이 아직 없으므로,
// 페이지 내에서 임시 상태로만 사용하거나 DB에 저장하지 않습니다.
// (현재 앱 로직상 텍스트 생성 용도로 주로 쓰임)
// 추후 필요 시 테이블을 추가하여 확장할 수 있습니다.
