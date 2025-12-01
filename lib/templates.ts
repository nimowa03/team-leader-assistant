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
[📢 ${teamName} 정기 모임 결과]
📅 일시: ${date}

👋 출석 현황
- 함께하신 분: ${presentMembers || '없음'}
- 조금 늦으신 분: ${lateMembers || '없음'}
- 아쉽게 못 오신 분: ${absentMembers || '없음'}

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
[🔥 ${teamName} 과제 현황 알림]
📅 마감: 일요일 오후 9시

📊 현재 제출율: ${rate}% (${submittedCount}/${totalCount}명)

✅ 제출 완료하신 분들 (고생하셨습니다!)
${submitted || '-'}

👀 아직 제출 전이신 분들 (화이팅!)
${notSubmitted || '없음 (전원 제출 완료! 🎉)'}

${notSubmitted ? '마감 시간 전까지 꼭 제출 부탁드립니다! 🙏' : '이번 주도 모두 정말 고생 많으셨습니다! 다음 주도 화이팅해요! 💪'}
`.trim();
};
