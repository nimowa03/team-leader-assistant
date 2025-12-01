import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { notes } = await request.json();

        if (!notes) {
            return NextResponse.json(
                { error: '회의 내용이 입력되지 않았습니다.' },
                { status: 400 }
            );
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { error: 'API 키가 설정되지 않았습니다.' },
                { status: 500 }
            );
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        const prompt = `
      당신은 유능한 회의록 정리 비서입니다. 
      아래의 두서없는 회의 메모를 바탕으로 깔끔하게 구조화된 회의록을 작성해주세요.
      
      [입력된 메모]
      ${notes}

      [작성 가이드]
      1. 아래 4가지 섹션으로 분류해서 작성해주세요.
         - 📌 안건 (Agenda)
         - 🗣️ 주요 논의 (Discussion)
         - ✨ 결정 사항 (Decision)
         - 🚀 다음 일정 및 과제 (Next Steps)
      2. 각 항목은 글머리 기호(-)를 사용하여 명확하게 정리해주세요.
      3. 말투는 "함", "결정함" 등 간결한 서술형으로 작성해주세요.
      4. 내용이 없는 섹션은 "없음"이라고 적어주세요.
      5. 불필요한 인삿말이나 사족은 빼고, 결과물만 출력해주세요.
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ result: text });
    } catch (error) {
        console.error('Gemini API Error:', error);
        return NextResponse.json(
            { error: '회의록 생성 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}
