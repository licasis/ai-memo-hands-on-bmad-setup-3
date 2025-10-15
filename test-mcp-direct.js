// MCP 서버를 직접 테스트
const { spawn } = require('child_process');

console.log('MCP 서버 직접 테스트 시작...');

// MCP 서버 프로세스 시작
const serverProcess = spawn('node', ['lib/mcp/servers/greeting-calculator-server.js'], {
  stdio: ['pipe', 'pipe', 'pipe']
});

serverProcess.on('error', (error) => {
  console.error('서버 시작 오류:', error);
});

serverProcess.stdout.on('data', (data) => {
  console.log('서버 출력:', data.toString());
});

serverProcess.stderr.on('data', (data) => {
  console.log('서버 오류:', data.toString());
});

// 잠시 기다린 후 MCP 클라이언트 테스트
setTimeout(async () => {
  console.log('MCP 클라이언트 테스트 시작...');

  try {
    const response = await fetch('http://localhost:3000/api/mcp/greeting', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'testuser',
        language: '일본어'
      })
    });

    const data = await response.json();
    console.log('API 응답:', JSON.stringify(data, null, 2));

  } catch (error) {
    console.error('API 호출 오류:', error);
  }

  // 서버 프로세스 종료
  serverProcess.kill();
}, 2000);
