import { Meeting, Assignment, Member, AttendanceStatus } from './types';



export const generateMeetingMinutes = (
    meeting: Meeting,
    members: Member[],
    teamName: string,
    content: string // Freeform or AI-generated content
): string => {
    const date = meeting.date;

    const presentMembers = meeting.records
        .filter(r => r.status === 'PRESENT')
        .map(r => members.find(m => m.id === r.memberId)?.name)
        .filter(Boolean)
        .join(', ');

    const lateMembers = meeting.records
        .filter(r => r.status === 'LATE')
        .map(r => members.find(m => m.id === r.memberId)?.name)
        .filter(Boolean)
        .join(', ');

    const absentMembers = meeting.records
        .filter(r => r.status === 'ABSENT')
        .map(r => members.find(m => m.id === r.memberId)?.name)
        .filter(Boolean)
        .join(', ');

    return `
[${teamName} 모임 회의록]
📅 일시: ${date}

✅ 출석 현황
- 참석: ${presentMembers || '없음'}
- 지각: ${lateMembers || '없음'}
- 결석: ${absentMembers || '없음'}

${content}
`.trim();
};

export const generateAssignmentNotice = (assignment: Assignment, members: Member[], teamName: string): string => {
    const submitted = assignment.records
        .filter(r => r.status === 'SUBMITTED')
        .map(r => members.find(m => m.id === r.memberId)?.name)
        .filter(Boolean)
        .join(', ');

    const notSubmitted = assignment.records
        .filter(r => r.status === 'NOT_SUBMITTED')
        .map(r => members.find(m => m.id === r.memberId)?.name)
        .filter(Boolean)
        .join(', ');

    const totalCount = members.length;
    const submittedCount = assignment.records.filter(r => r.status === 'SUBMITTED').length;
    const rate = Math.round((submittedCount / totalCount) * 100) || 0;

    return `
[${teamName} 과제 현황 보고]
📅 마감: 일요일 오후 9시

📊 제출율: ${rate}% (${submittedCount}/${totalCount}명)

✅ 제출 완료
${submitted || '-'}

⚠️ 미제출 (확인 필요)
${notSubmitted || '없음 (전원 제출 완료! 🎉)'}

${notSubmitted ? '아직 제출하지 못하신 분들은 서둘러주세요! 🔥' : '이번 주도 모두 고생 많으셨습니다!'}
`.trim();
};
