import { addMember, getMembers, deleteMember } from '../lib/storage';

async function verify() {
    console.log('🔄 Supabase 연동 테스트 시작...');

    try {
        // 1. Add Test Member
        console.log('1. 테스트 멤버 추가 중...');
        const newMember = await addMember('테스트_조원');

        if (!newMember) {
            console.error('❌ 멤버 추가 실패: 반환된 객체가 없습니다.');
            return;
        }
        console.log(`✅ 멤버 추가 성공: ${newMember.name} (ID: ${newMember.id})`);

        // 2. Fetch Members
        console.log('2. 멤버 목록 조회 중...');
        const members = await getMembers();
        const found = members.find(m => m.id === newMember.id);

        if (found) {
            console.log(`✅ 데이터 조회 성공: DB에서 ${found.name}을(를) 찾았습니다.`);
        } else {
            console.error('❌ 데이터 조회 실패: 방금 추가한 멤버가 목록에 없습니다.');
            return;
        }

        // 3. Clean up
        console.log('3. 테스트 데이터 정리 중...');
        await deleteMember(newMember.id);
        console.log('✅ 테스트 데이터 삭제 완료');

        console.log('🎉 모든 테스트 통과! Supabase가 정상 작동 중입니다.');

    } catch (error) {
        console.error('❌ 테스트 중 에러 발생:', error);
    }
}

verify();
