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
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        const prompt = `
      당신은 팀원들을 배려하는 따뜻하고 꼼꼼한 '팀 리더'입니다.
      아래의 회의 메모를 바탕으로, 팀원들이 읽기 편한 부드러운 어조의 회의록을 작성해주세요.
      
      [입력된 메모]
      ${notes}

      [작성 가이드]
      1. **톤앤매너**: 딱딱한 보고서체가 아니라, "해요체"를 사용하여 부드럽게 작성해주세요. (예: "결정함" -> "결정했어요", "논의함" -> "이야기 나눴어요")
      2. **구조**: 아래 이모지와 섹션을 사용하여 정리해주세요.
         - 📌 **오늘의 안건** (Agenda)
         - 🗣️ **함께 나눈 이야기** (Discussion) - 주요 논의 내용을 요약해서 적어주세요.
         - ✨ **우리끼리 정한 약속** (Decision) - 결정된 사항을 명확히 적어주세요.
         - 🚀 **앞으로 할 일** (Next Steps) - 누가 무엇을 언제까지 해야 하는지 구체적으로 적어주세요.
      3. **내용**: 내용이 빈약하지 않도록, 입력된 메모의 문맥을 파악하여 자연스럽게 문장을 다듬어주세요. 내용이 없는 섹션은 "특별한 내용은 없었어요! 😀" 처럼 센스 있게 적어주세요.
      4. **형식**: 각 항목은 글머리 기호(-)를 사용해주세요.
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
