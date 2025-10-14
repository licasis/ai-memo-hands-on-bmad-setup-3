// __tests__/auth/logout.test.tsx
// 로그아웃 컴포넌트 테스트 파일
// LogoutButton 컴포넌트의 다양한 시나리오를 테스트합니다
// 관련 파일: components/auth/logout-button.tsx, app/auth/logout/actions.ts

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LogoutButton } from '@/components/auth/logout-button'
import { logoutAction } from '@/app/auth/logout/actions'

// 서버 액션 모킹
jest.mock('@/app/auth/logout/actions', () => ({
  logoutAction: jest.fn(),
}))

const mockLogoutAction = logoutAction as jest.MockedFunction<typeof logoutAction>

describe('LogoutButton', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('로그아웃 버튼이 올바르게 렌더링된다', () => {
    render(<LogoutButton />)
    
    expect(screen.getByRole('button', { name: '로그아웃' })).toBeInTheDocument()
  })

  it('기본 props로 렌더링된다', () => {
    render(<LogoutButton />)
    
    const button = screen.getByRole('button', { name: '로그아웃' })
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('bg-background')
  })

  it('커스텀 props로 렌더링된다', () => {
    render(
      <LogoutButton 
        variant="destructive" 
        size="sm" 
        className="custom-class"
      />
    )
    
    const button = screen.getByRole('button', { name: '로그아웃' })
    expect(button).toHaveClass('custom-class')
  })

  it('로그아웃 버튼 클릭 시 로그아웃 액션을 호출한다', async () => {
    const user = userEvent.setup()
    mockLogoutAction.mockResolvedValue({ success: true })
    
    render(<LogoutButton />)
    
    const button = screen.getByRole('button', { name: '로그아웃' })
    await user.click(button)
    
    await waitFor(() => {
      expect(mockLogoutAction).toHaveBeenCalledTimes(1)
    })
  })

  it('로그아웃 성공 시 로딩 상태를 표시한다', async () => {
    const user = userEvent.setup()
    mockLogoutAction.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({ success: true }), 100)))
    
    render(<LogoutButton />)
    
    const button = screen.getByRole('button', { name: '로그아웃' })
    await user.click(button)
    
    expect(screen.getByText('로그아웃 중...')).toBeInTheDocument()
    expect(button).toBeDisabled()
  })

  it('로그아웃 실패 시 에러 메시지를 표시한다', async () => {
    const user = userEvent.setup()
    mockLogoutAction.mockResolvedValue({ 
      success: false, 
      error: '로그아웃 중 오류가 발생했습니다.' 
    })
    
    render(<LogoutButton />)
    
    const button = screen.getByRole('button', { name: '로그아웃' })
    await user.click(button)
    
    await waitFor(() => {
      expect(screen.getByText('로그아웃 중 오류가 발생했습니다.')).toBeInTheDocument()
    })
  })

  it('네트워크 오류 시 에러 메시지를 표시한다', async () => {
    const user = userEvent.setup()
    mockLogoutAction.mockRejectedValue(new Error('Network error'))
    
    render(<LogoutButton />)
    
    const button = screen.getByRole('button', { name: '로그아웃' })
    await user.click(button)
    
    await waitFor(() => {
      expect(screen.getByText('로그아웃 중 오류가 발생했습니다.')).toBeInTheDocument()
    })
  })

  it('로그아웃 성공 후 버튼이 다시 활성화된다', async () => {
    const user = userEvent.setup()
    mockLogoutAction.mockResolvedValue({ success: true })
    
    render(<LogoutButton />)
    
    const button = screen.getByRole('button', { name: '로그아웃' })
    await user.click(button)
    
    await waitFor(() => {
      expect(screen.getByText('로그아웃')).toBeInTheDocument()
      expect(button).not.toBeDisabled()
    })
  })
})
