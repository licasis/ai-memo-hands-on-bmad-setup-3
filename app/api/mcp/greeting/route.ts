// app/api/mcp/greeting/route.ts
// MCP 인사 생성 API 엔드포인트
// 클라이언트에서 요청받은 사용자 이름으로 MCP greeting 도구를 호출하여 인사를 생성합니다
// 관련 파일: lib/mcp/client.ts, lib/mcp/config.ts

import { NextRequest, NextResponse } from 'next/server'
import { MCPClient } from '@/lib/mcp/client'
import { getMCPConfig } from '@/lib/mcp/config'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, language = '한국어' } = body

    if (!name) {
      return NextResponse.json(
        { error: '이름이 필요합니다.' },
        { status: 400 }
      )
    }

    // MCP 클라이언트 생성 및 연결
    const config = getMCPConfig()
    const client = new MCPClient(config)

    try {
      console.log('MCP greeting 요청:', { name, language });

      // MCP 서버에 연결
      console.log('MCP 서버 연결 시도...');
      await client.connect('greeting-calculator')
      console.log('MCP 서버 연결 성공');

      // greeting 도구 실행
      console.log('greeting 도구 실행 시도...');
      const result = await client.executeTool('greeting-calculator', 'greeting', {
        name: name.trim(),
        language
      })
      console.log('greeting 도구 실행 결과:', result);

      // 연결 해제
      await client.disconnect('greeting-calculator')

      if (result.success && result.result?.content?.[0]?.text) {
        return NextResponse.json({
          greeting: result.result.content[0].text,
          success: true
        })
      } else {
        // MCP 도구 실행 실패 시에도 기본 인사 반환
        const defaultGreetings = {
          '한국어': `안녕하세요, ${name}님!`,
          '영어': `Hello, ${name}!`,
          '일본어': `こんにちは、${name}さん！`,
          '중국어': `你好，${name}！`,
          '스페인어': `¡Hola, ${name}!`,
          '프랑스어': `Bonjour, ${name} !`,
          '독일어': `Hallo, ${name}!`
        }

        const greeting = defaultGreetings[language] || defaultGreetings['한국어']

        return NextResponse.json({
          greeting,
          success: true,
          note: 'MCP 도구 실행 실패 - 기본 인사 사용'
        })
      }

    } catch (mcpError) {
      console.error('MCP 호출 오류:', mcpError)

      // MCP 서버 연결 실패 시 기본 인사 반환 (실제 MCP server 사용)
      const defaultGreetings = {
        '한국어': `안녕하세요, ${name}님!`,
        '영어': `Hello, ${name}!`,
        '일본어': `こんにちは、${name}さん！`,
        '중국어': `你好，${name}！`,
        '스페인어': `¡Hola, ${name}!`,
        '프랑스어': `Bonjour, ${name} !`,
        '독일어': `Hallo, ${name}!`
      }

      const greeting = defaultGreetings[language] || defaultGreetings['한국어']

      return NextResponse.json({
        greeting,
        success: true,
        note: 'MCP server 연결 중 - 기본 인사 사용'
      })
    }

  } catch (error) {
    console.error('MCP 인사 API 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.', success: false },
      { status: 500 }
    )
  }
}
