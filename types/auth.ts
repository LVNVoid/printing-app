export interface LoginFormData {
  email: string;
  password: string;
}
export interface LoginFormProps extends Omit<React.ComponentProps<'div'>, 'onError'> {
  onLoginError?: (data: string) => void;
  onError?: (error: string) => void;
  redirectTo?: string;
}

export interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}
