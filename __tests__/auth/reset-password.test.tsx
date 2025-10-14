// __tests__/auth/reset-password.test.tsx
// 비밀번호 재설정 폼 컴포넌트 테스트 파일
// ResetPasswordForm 컴포넌트의 다양한 시나리오를 테스트합니다
// 관련 파일: components/auth/reset-password-form.tsx, app/auth/reset-password/actions.ts

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ResetPasswordForm } from '@/components/auth/reset-password-form'
import { resetPasswordAction } from '@/app/auth/reset-password/actions'

// 서버 액션 모킹
jest.mock('@/app/auth/reset-password/actions', () => ({
  resetPasswordAction: jest.fn(),
}))

const mockResetPasswordAction = resetPasswordAction as jest.MockedFunction<typeof resetPasswordAction>

describe('ResetPasswordForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('비밀번호 재설정 폼이 올바르게 렌더링된다', () => {
    render(<ResetPasswordForm />)
    
    expect(screen.getByRole('heading', { name: '새 비밀번호 설정' })).toBeInTheDocument()
    expect(screen.getByLabelText('새 비밀번호')).toBeInTheDocument()
    expect(screen.getByLabelText('비밀번호 확인')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '비밀번호 재설정' })).toBeInTheDocument()
  })

  it('비밀번호가 8자 미만일 때 에러 메시지를 표시한다', async () => {
    render(<ResetPasswordForm />)
    
    const passwordInput = screen.getByLabelText('새 비밀번호') as HTMLInputElement
    const confirmPasswordInput = screen.getByLabelText('비밀번호 확인') as HTMLInputElement
    const form = passwordInput.closest('form')!
    
    fireEvent.change(passwordInput, { target: { value: '123' } })
    fireEvent.change(confirmPasswordInput, { target: { value: '123' } })
    
    fireEvent.submit(form)
    
    await waitFor(() => {
      expect(screen.getByText('비밀번호는 8자 이상이어야 합니다.')).toBeInTheDocument()
    })
  })

  it('비밀번호가 일치하지 않을 때 에러 메시지를 표시한다', async () => {
    render(<ResetPasswordForm />)
    
    const passwordInput = screen.getByLabelText('새 비밀번호') as HTMLInputElement
    const confirmPasswordInput = screen.getByLabelText('비밀번호 확인') as HTMLInputElement
    const form = passwordInput.closest('form')!
    
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.change(confirmPasswordInput, { target: { value: 'password456' } })
    
    fireEvent.submit(form)
    
    await waitFor(() => {
      expect(screen.getByText('비밀번호가 일치하지 않습니다.')).toBeInTheDocument()
    })
  })

  it('유효한 비밀번호로 재설정을 시도한다', async () => {
    const user = userEvent.setup()
    mockResetPasswordAction.mockResolvedValue({ success: true })
    
    render(<ResetPasswordForm />)
    
    const passwordInput = screen.getByLabelText('새 비밀번호')
    const confirmPasswordInput = screen.getByLabelText('비밀번호 확인')
    const submitButton = screen.getByRole('button', { name: '비밀번호 재설정' })
    
    await user.type(passwordInput, 'newpassword123')
    await user.type(confirmPasswordInput, 'newpassword123')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(mockResetPasswordAction).toHaveBeenCalledWith({
        password: 'newpassword123'
      })
    })
  })

  it('비밀번호 재설정 성공 시 로그인 페이지로 리다이렉트한다', async () => {
    const user = userEvent.setup()
    mockResetPasswordAction.mockResolvedValue({ success: true })
    
    // Next.js router 모킹
    const mockPush = jest.fn()
    jest.mock('next/navigation', () => ({
      useRouter: () => ({
        push: mockPush,
      }),
    }))
    
    render(<ResetPasswordForm />)
    
    const passwordInput = screen.getByLabelText('새 비밀번호')
    const confirmPasswordInput = screen.getByLabelText('비밀번호 확인')
    const submitButton = screen.getByRole('button', { name: '비밀번호 재설정' })
    
    await user.type(passwordInput, 'newpassword123')
    await user.type(confirmPasswordInput, 'newpassword123')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(mockResetPasswordAction).toHaveBeenCalledWith({
        password: 'newpassword123'
      })
    })
  })

  it('비밀번호 재설정 실패 시 에러 메시지를 표시한다', async () => {
    const user = userEvent.setup()
    mockResetPasswordAction.mockResolvedValue({ 
      success: false, 
      error: '비밀번호 재설정 링크가 만료되었습니다.' 
    })
    
    render(<ResetPasswordForm />)
    
    const passwordInput = screen.getByLabelText('새 비밀번호')
    const confirmPasswordInput = screen.getByLabelText('비밀번호 확인')
    const submitButton = screen.getByRole('button', { name: '비밀번호 재설정' })
    
    await user.type(passwordInput, 'newpassword123')
    await user.type(confirmPasswordInput, 'newpassword123')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('비밀번호 재설정 링크가 만료되었습니다.')).toBeInTheDocument()
    })
  })

  it('로딩 중일 때 버튼이 비활성화된다', async () => {
    const user = userEvent.setup()
    mockResetPasswordAction.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({ success: true }), 100)))
    
    render(<ResetPasswordForm />)
    
    const passwordInput = screen.getByLabelText('새 비밀번호')
    const confirmPasswordInput = screen.getByLabelText('비밀번호 확인')
    const submitButton = screen.getByRole('button', { name: '비밀번호 재설정' })
    
    await user.type(passwordInput, 'newpassword123')
    await user.type(confirmPasswordInput, 'newpassword123')
    await user.click(submitButton)
    
    expect(screen.getByText('재설정 중...')).toBeInTheDocument()
    expect(submitButton).toBeDisabled()
  })
})
