// MCP 인사 API 테스트 - 로그인 계정명으로 일본어 인사
fetch('http://localhost:3000/api/mcp/greeting', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'testuser', // 로그인 계정명 예시
    language: '일본어'
  })
})
.then(response => response.json())
.then(data => {
  console.log('응답:', JSON.stringify(data, null, 2));
})
.catch(error => {
  console.error('오류:', error.message);
});