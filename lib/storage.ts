import { supabase } from './supabase';
import { Member, Meeting, Assignment, AppSettings } from './types';

// --- Members ---
export const getMembers = async (): Promise<Member[]> => {
    const { data, error } = await supabase
        .from('members')
        .select('*')
        .order('created_at', { ascending: true });

    if (error) {
        console.error('Error fetching members:', error);
        return [];
    }

    // Map DB columns to Member type (snake_case to camelCase)
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
        console.error('Error adding member:', error);
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
    // Convert camelCase updates to snake_case for DB
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
        console.error('Error updating member:', error);
    }
};

export const deleteMember = async (id: string) => {
    const { error } = await supabase
        .from('members')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting member:', error);
    }
};

// --- Settings ---
export const getSettings = async (): Promise<AppSettings> => {
    const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('id', 1)
        .single();

    if (error) {
        // If no settings found (first run), return default
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
        console.error('Error saving settings:', error);
    }
};

// --- Meetings & Assignments (Local State Only for now) ---
// Since we don't have tables for meetings/assignments history yet, 
// we will keep using them as temporary state in the pages or just not persist them fully 
// (as per current app logic, they are mostly for generating text).
// However, to keep the app consistent, we might want to just keep the types but remove storage logic 
// if they are not being saved to DB. 
// For this phase, we focus on Members and Settings persistence.
