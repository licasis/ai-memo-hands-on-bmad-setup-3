// __tests__/auth/login.test.tsx
// 로그인 컴포넌트 테스트 파일
// LoginForm 컴포넌트의 다양한 시나리오를 테스트합니다
// 관련 파일: components/auth/login-form.tsx, app/auth/login/actions.ts

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LoginForm } from '@/components/auth/login-form'
import { signInAction } from '@/app/auth/login/actions'

// 서버 액션 모킹
jest.mock('@/app/auth/login/actions', () => ({
  signInAction: jest.fn(),
}))

const mockSignInAction = signInAction as jest.MockedFunction<typeof signInAction>

describe('LoginForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('로그인 폼이 올바르게 렌더링된다', () => {
    render(<LoginForm />)
    
    expect(screen.getByRole('heading', { name: '로그인' })).toBeInTheDocument()
    expect(screen.getByLabelText('이메일')).toBeInTheDocument()
    expect(screen.getByLabelText('비밀번호')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '로그인' })).toBeInTheDocument()
    expect(screen.getByText('비밀번호를 잊으셨나요?')).toBeInTheDocument()
  })

  it('유효하지 않은 이메일 형식에 대해 에러 메시지를 표시한다', async () => {
    render(<LoginForm />)
    
    const emailInput = screen.getByLabelText('이메일') as HTMLInputElement
    const passwordInput = screen.getByLabelText('비밀번호') as HTMLInputElement
    const form = emailInput.closest('form')!
    
    // HTML5 validation을 우회하기 위해 직접 상태 변경
    fireEvent.change(emailInput, { target: { value: 'notanemail' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    
    // form submit 이벤트를 직접 트리거
    fireEvent.submit(form)
    
    await waitFor(() => {
      expect(screen.getByText('유효한 이메일 주소를 입력해주세요.')).toBeInTheDocument()
    })
  })

  it('비밀번호가 비어있을 때 에러 메시지를 표시한다', async () => {
    render(<LoginForm />)
    
    const emailInput = screen.getByLabelText('이메일') as HTMLInputElement
    const passwordInput = screen.getByLabelText('비밀번호') as HTMLInputElement
    const form = emailInput.closest('form')!
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: '' } })
    
    fireEvent.submit(form)
    
    await waitFor(() => {
      expect(screen.getByText('비밀번호를 입력해주세요.')).toBeInTheDocument()
    })
  })

  it('유효한 입력으로 로그인을 시도한다', async () => {
    const user = userEvent.setup()
    mockSignInAction.mockResolvedValue({ success: true })
    
    render(<LoginForm />)
    
    const emailInput = screen.getByLabelText('이메일')
    const passwordInput = screen.getByLabelText('비밀번호')
    const submitButton = screen.getByRole('button', { name: '로그인' })
    
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(mockSignInAction).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      })
    })
  })

  it('잘못된 자격증명으로 로그인 실패 시 에러 메시지를 표시한다', async () => {
    const user = userEvent.setup()
    mockSignInAction.mockResolvedValue({ 
      success: false, 
      error: '이메일 또는 비밀번호가 올바르지 않습니다.' 
    })
    
    render(<LoginForm />)
    
    const emailInput = screen.getByLabelText('이메일')
    const passwordInput = screen.getByLabelText('비밀번호')
    const submitButton = screen.getByRole('button', { name: '로그인' })
    
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'wrongpassword')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('이메일 또는 비밀번호가 올바르지 않습니다.')).toBeInTheDocument()
    })
  })

  it('이메일 미인증 에러 메시지를 표시한다', async () => {
    const user = userEvent.setup()
    mockSignInAction.mockResolvedValue({ 
      success: false, 
      error: '이메일 인증이 완료되지 않았습니다. 이메일을 확인해주세요.' 
    })
    
    render(<LoginForm />)
    
    const emailInput = screen.getByLabelText('이메일')
    const passwordInput = screen.getByLabelText('비밀번호')
    const submitButton = screen.getByRole('button', { name: '로그인' })
    
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('이메일 인증이 완료되지 않았습니다. 이메일을 확인해주세요.')).toBeInTheDocument()
    })
  })

  it('로딩 중일 때 버튼이 비활성화된다', async () => {
    const user = userEvent.setup()
    mockSignInAction.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({ success: true }), 100)))
    
    render(<LoginForm />)
    
    const emailInput = screen.getByLabelText('이메일')
    const passwordInput = screen.getByLabelText('비밀번호')
    const submitButton = screen.getByRole('button', { name: '로그인' })
    
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)
    
    expect(screen.getByText('로그인 중...')).toBeInTheDocument()
    expect(submitButton).toBeDisabled()
  })

  it('비밀번호 찾기 링크가 올바르게 렌더링된다', () => {
    render(<LoginForm />)
    
    const forgotPasswordLink = screen.getByText('비밀번호를 잊으셨나요?')
    expect(forgotPasswordLink).toBeInTheDocument()
    expect(forgotPasswordLink.closest('a')).toHaveAttribute('href', '/auth/forgot-password')
  })
})
