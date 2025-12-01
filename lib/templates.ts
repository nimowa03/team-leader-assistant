import { Meeting, Assignment, Member, AttendanceStatus } from './types';



export const generateMeetingMinutes = (
    meeting: Meeting,
    members: Member[],
    teamName: string,
    content: string // Freeform or AI-generated content
): string => {
    const date = meeting.date;

    const presentList = meeting.records
        .filter(r => r.status === 'PRESENT')
        .map(r => members.find(m => m.id === r.memberId)?.name)
        .filter(Boolean);

    const lateList = meeting.records
        .filter(r => r.status === 'LATE')
        .map(r => members.find(m => m.id === r.memberId)?.name)
        .filter(Boolean);

    const absentList = meeting.records
        .filter(r => r.status === 'ABSENT')
        .map(r => members.find(m => m.id === r.memberId)?.name)
        .filter(Boolean);

    let attendanceSection = `✅ 참석 (${presentList.length}명): ${presentList.join(', ')}`;

    if (lateList.length > 0) {
        attendanceSection += `\n⚠️ 지각 (${lateList.length}명): ${lateList.join(', ')}`;
    }

    if (absentList.length > 0) {
        attendanceSection += `\n❌ 결석 (${absentList.length}명): ${absentList.join(', ')}`;
    }

    if (lateList.length === 0 && absentList.length === 0) {
        attendanceSection = `🎉 전원 참석! (${presentList.length}명)\n   ${presentList.join(', ')}`;
    }

    return `
[📢 ${teamName} 정기 모임 결과]
📅 일시: ${date}

${attendanceSection}

${content}
`.trim();
};

export const generateAssignmentNotice = (assignment: Assignment, members: Member[], teamName: string): string => {
    const submittedList = assignment.records
        .filter(r => r.status === 'SUBMITTED')
        .map(r => members.find(m => m.id === r.memberId)?.name)
        .filter(Boolean);

    const notSubmittedList = assignment.records
        .filter(r => r.status === 'NOT_SUBMITTED')
        .map(r => members.find(m => m.id === r.memberId)?.name)
        .filter(Boolean);

    const totalCount = members.length;
    const submittedCount = submittedList.length;
    const rate = Math.round((submittedCount / totalCount) * 100) || 0;

    let statusSection = '';

    if (submittedCount > 0) {
        statusSection += `✅ 제출 완료: ${submittedList.join(', ')}\n`;
    }

    if (notSubmittedList.length > 0) {
        statusSection += `👀 미제출: ${notSubmittedList.join(', ')}\n`;
    }

    if (submittedCount === totalCount) {
        statusSection = `🎉 와우! 전원 제출 완료! 고생하셨습니다. 👏👏👏\n`;
    }

    const footerMessage = notSubmittedList.length > 0
        ? '마감 시간 전까지 꼭 제출 부탁드립니다! 🙏'
        : '이번 주도 모두 정말 고생 많으셨습니다!';

    return `
[🔥 ${teamName} 과제 현황]
📅 마감: 일요일 오후 9시
📊 제출율: ${rate}% (${submittedCount}/${totalCount}명)

${statusSection}
${footerMessage}
`.trim();
};
