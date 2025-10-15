// 대시보드 인사말 테스트
fetch('http://localhost:3000/api/mcp/greeting', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'lovelyguy',
    language: '일본어'
  })
})
.then(response => response.json())
.then(data => {
  console.log('인사말:', data.greeting);
  console.log('전체 응답:', JSON.stringify(data, null, 2));
})
.catch(error => {
  console.error('오류:', error.message);
});
