// __tests__/auth/forgot-password.test.tsx
// 비밀번호 재설정 요청 컴포넌트 테스트 파일
// ForgotPasswordForm 컴포넌트의 다양한 시나리오를 테스트합니다
// 관련 파일: components/auth/forgot-password-form.tsx, app/auth/forgot-password/actions.ts

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ForgotPasswordForm } from '@/components/auth/forgot-password-form'
import { forgotPasswordAction } from '@/app/auth/forgot-password/actions'

// 서버 액션 모킹
jest.mock('@/app/auth/forgot-password/actions', () => ({
  forgotPasswordAction: jest.fn(),
}))

const mockForgotPasswordAction = forgotPasswordAction as jest.MockedFunction<typeof forgotPasswordAction>

describe('ForgotPasswordForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('비밀번호 재설정 폼이 올바르게 렌더링된다', () => {
    render(<ForgotPasswordForm />)
    
    expect(screen.getByRole('heading', { name: '비밀번호 재설정' })).toBeInTheDocument()
    expect(screen.getByLabelText('이메일')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '비밀번호 재설정 링크 보내기' })).toBeInTheDocument()
  })

  it('유효하지 않은 이메일 형식에 대해 에러 메시지를 표시한다', async () => {
    render(<ForgotPasswordForm />)
    
    const emailInput = screen.getByLabelText('이메일') as HTMLInputElement
    const form = emailInput.closest('form')!
    
    // HTML5 validation을 우회하기 위해 직접 상태 변경
    fireEvent.change(emailInput, { target: { value: 'notanemail' } })
    
    // form submit 이벤트를 직접 트리거
    fireEvent.submit(form)
    
    await waitFor(() => {
      expect(screen.getByText('유효한 이메일 주소를 입력해주세요.')).toBeInTheDocument()
    })
  })

  it('유효한 이메일로 비밀번호 재설정 요청을 시도한다', async () => {
    const user = userEvent.setup()
    mockForgotPasswordAction.mockResolvedValue({ success: true })
    
    render(<ForgotPasswordForm />)
    
    const emailInput = screen.getByLabelText('이메일')
    const submitButton = screen.getByRole('button', { name: '비밀번호 재설정 링크 보내기' })
    
    await user.type(emailInput, 'test@example.com')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(mockForgotPasswordAction).toHaveBeenCalledWith({
        email: 'test@example.com'
      })
    })
  })

  it('비밀번호 재설정 요청 성공 시 성공 메시지를 표시한다', async () => {
    const user = userEvent.setup()
    mockForgotPasswordAction.mockResolvedValue({ success: true })
    
    render(<ForgotPasswordForm />)
    
    const emailInput = screen.getByLabelText('이메일')
    const submitButton = screen.getByRole('button', { name: '비밀번호 재설정 링크 보내기' })
    
    await user.type(emailInput, 'test@example.com')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('이메일을 확인하세요')).toBeInTheDocument()
      expect(screen.getByText('비밀번호 재설정 링크를 test@example.com로 발송했습니다.')).toBeInTheDocument()
    })
  })

  it('존재하지 않는 이메일로 요청 시 에러 메시지를 표시한다', async () => {
    const user = userEvent.setup()
    mockForgotPasswordAction.mockResolvedValue({ 
      success: false, 
      error: '존재하지 않는 이메일 주소입니다.' 
    })
    
    render(<ForgotPasswordForm />)
    
    const emailInput = screen.getByLabelText('이메일')
    const submitButton = screen.getByRole('button', { name: '비밀번호 재설정 링크 보내기' })
    
    await user.type(emailInput, 'nonexistent@example.com')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('존재하지 않는 이메일 주소입니다.')).toBeInTheDocument()
    })
  })

  it('로딩 중일 때 버튼이 비활성화된다', async () => {
    const user = userEvent.setup()
    mockForgotPasswordAction.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({ success: true }), 100)))
    
    render(<ForgotPasswordForm />)
    
    const emailInput = screen.getByLabelText('이메일')
    const submitButton = screen.getByRole('button', { name: '비밀번호 재설정 링크 보내기' })
    
    await user.type(emailInput, 'test@example.com')
    await user.click(submitButton)
    
    expect(screen.getByText('요청 중...')).toBeInTheDocument()
    expect(submitButton).toBeDisabled()
  })

  it('성공 후 다시 시도 버튼을 클릭하면 폼이 초기화된다', async () => {
    const user = userEvent.setup()
    mockForgotPasswordAction.mockResolvedValue({ success: true })
    
    render(<ForgotPasswordForm />)
    
    const emailInput = screen.getByLabelText('이메일')
    const submitButton = screen.getByRole('button', { name: '비밀번호 재설정 링크 보내기' })
    
    await user.type(emailInput, 'test@example.com')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('이메일을 확인하세요')).toBeInTheDocument()
    })
    
    const tryAgainButton = screen.getByRole('button', { name: '다시 시도' })
    await user.click(tryAgainButton)
    
    expect(screen.getByRole('heading', { name: '비밀번호 재설정' })).toBeInTheDocument()
    expect(screen.getByLabelText('이메일')).toHaveValue('')
  })
})
