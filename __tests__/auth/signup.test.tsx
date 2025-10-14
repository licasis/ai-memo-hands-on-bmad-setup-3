// __tests__/auth/signup.test.tsx
// 회원가입 컴포넌트 테스트 파일
// SignupForm 컴포넌트의 다양한 시나리오를 테스트합니다
// 관련 파일: components/auth/signup-form.tsx, app/auth/signup/actions.ts

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SignupForm } from '@/components/auth/signup-form'
import { signUpAction } from '@/app/auth/signup/actions'

// 서버 액션 모킹
jest.mock('@/app/auth/signup/actions', () => ({
  signUpAction: jest.fn(),
}))

const mockSignUpAction = signUpAction as jest.MockedFunction<typeof signUpAction>

describe('SignupForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('회원가입 폼이 올바르게 렌더링된다', () => {
    render(<SignupForm />)
    
    expect(screen.getByRole('heading', { name: '회원가입' })).toBeInTheDocument()
    expect(screen.getByLabelText('이메일')).toBeInTheDocument()
    expect(screen.getByLabelText('비밀번호')).toBeInTheDocument()
    expect(screen.getByLabelText('비밀번호 확인')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '회원가입' })).toBeInTheDocument()
  })

  it('유효하지 않은 이메일 형식에 대해 에러 메시지를 표시한다', async () => {
    render(<SignupForm />)
    
    const emailInput = screen.getByLabelText('이메일') as HTMLInputElement
    const passwordInput = screen.getByLabelText('비밀번호') as HTMLInputElement
    const confirmPasswordInput = screen.getByLabelText('비밀번호 확인') as HTMLInputElement
    const form = emailInput.closest('form')!
    
    // HTML5 validation을 우회하기 위해 직접 상태 변경
    fireEvent.change(emailInput, { target: { value: 'notanemail' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } })
    
    // form submit 이벤트를 직접 트리거 (preventDefault 포함)
    fireEvent.submit(form)
    
    await waitFor(() => {
      expect(screen.getByText('유효한 이메일 주소를 입력해주세요.')).toBeInTheDocument()
    })
  })

  it('8자 미만의 비밀번호에 대해 에러 메시지를 표시한다', async () => {
    const user = userEvent.setup()
    render(<SignupForm />)
    
    const emailInput = screen.getByLabelText('이메일')
    const passwordInput = screen.getByLabelText('비밀번호')
    const confirmPasswordInput = screen.getByLabelText('비밀번호 확인')
    const submitButton = screen.getByRole('button', { name: '회원가입' })
    
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, '1234567')
    await user.type(confirmPasswordInput, '1234567')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('비밀번호는 8자 이상이어야 합니다.')).toBeInTheDocument()
    })
  })

  it('비밀번호가 일치하지 않을 때 에러 메시지를 표시한다', async () => {
    const user = userEvent.setup()
    render(<SignupForm />)
    
    const emailInput = screen.getByLabelText('이메일')
    const passwordInput = screen.getByLabelText('비밀번호')
    const confirmPasswordInput = screen.getByLabelText('비밀번호 확인')
    const submitButton = screen.getByRole('button', { name: '회원가입' })
    
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.type(confirmPasswordInput, 'different123')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('비밀번호가 일치하지 않습니다.')).toBeInTheDocument()
    })
  })

  it('유효한 입력으로 회원가입을 시도한다', async () => {
    const user = userEvent.setup()
    mockSignUpAction.mockResolvedValue({ success: true })
    
    render(<SignupForm />)
    
    const emailInput = screen.getByLabelText('이메일')
    const passwordInput = screen.getByLabelText('비밀번호')
    const confirmPasswordInput = screen.getByLabelText('비밀번호 확인')
    const submitButton = screen.getByRole('button', { name: '회원가입' })
    
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.type(confirmPasswordInput, 'password123')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(mockSignUpAction).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      })
    })
  })

  it('회원가입 실패 시 에러 메시지를 표시한다', async () => {
    const user = userEvent.setup()
    mockSignUpAction.mockResolvedValue({ 
      success: false, 
      error: '이미 존재하는 이메일입니다.' 
    })
    
    render(<SignupForm />)
    
    const emailInput = screen.getByLabelText('이메일')
    const passwordInput = screen.getByLabelText('비밀번호')
    const confirmPasswordInput = screen.getByLabelText('비밀번호 확인')
    const submitButton = screen.getByRole('button', { name: '회원가입' })
    
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.type(confirmPasswordInput, 'password123')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('이미 존재하는 이메일입니다.')).toBeInTheDocument()
    })
  })

  it('로딩 중일 때 버튼이 비활성화된다', async () => {
    const user = userEvent.setup()
    mockSignUpAction.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({ success: true }), 100)))
    
    render(<SignupForm />)
    
    const emailInput = screen.getByLabelText('이메일')
    const passwordInput = screen.getByLabelText('비밀번호')
    const confirmPasswordInput = screen.getByLabelText('비밀번호 확인')
    const submitButton = screen.getByRole('button', { name: '회원가입' })
    
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.type(confirmPasswordInput, 'password123')
    await user.click(submitButton)
    
    expect(screen.getByText('처리 중...')).toBeInTheDocument()
    expect(submitButton).toBeDisabled()
  })
})
