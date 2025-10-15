// 헤더 인사말 테스트
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
  console.log('헤더 인사말:', data.greeting);
  console.log('응답 상태:', data.success);
})
.catch(error => {
  console.error('오류:', error.message);
});
