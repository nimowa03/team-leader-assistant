import { getMembers } from '../lib/storage';

async function checkData() {
    console.log('🔍 Supabase 데이터 조회 중...');

    try {
        const members = await getMembers();

        if (members.length === 0) {
            console.log('⚠️ 저장된 조원이 없습니다.');
        } else {
            console.log(`✅ 총 ${members.length}명의 조원이 조회되었습니다.`);
            console.log('--- 조원 목록 ---');
            members.forEach((m, i) => {
                console.log(`${i + 1}. ${m.name} (상태: ${m.status})`);
            });
            console.log('-----------------');
        }

    } catch (error) {
        console.error('❌ 데이터 조회 중 에러 발생:', error);
    }
}

checkData();
