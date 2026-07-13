import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterFormValues } from './registerSchema';
import { useNavigate } from 'react-router';
import { useAuth } from './AuthContext';

export default function RegisterForm() {
    const {
        register: registerField,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
    });
    const { register, login, getMe } = useAuth();
    const [error, setError] = useState<string>("");
    const [demoLoading, setDemoLoading] = useState(false);
    const navigate = useNavigate();

    const handleDemoLogin = async () => {
        setError("");
        setDemoLoading(true);
        try {
            const res = await login(import.meta.env.VITE_DEMO_EMAIL, import.meta.env.VITE_DEMO_PASSWORD);
            if (!res.ok) {
                setError("Demo login failed");
                return;
            }
            await getMe();
            navigate("/");
        } catch {
            setError("Demo login failed");
        } finally {
            setDemoLoading(false);
        }
    };

    const onSubmit = async (values: RegisterFormValues) => {
        try {
            const res = await register(values.email, values.password);
            if (!res.ok) {
                if (res.status === 400) {
                    const problem = await res.json().catch(() => null);
                    const messages: string[] = problem?.errors
                        ? Object.values(problem.errors).flat().map(String)
                        : [];
                    setError(messages[0] ?? 'Registration failed');
                } else {
                    setError("Something went wrong");
                }
                return;
            }

            const loginRes = await login(values.email, values.password);
            if (!loginRes.ok) {
                setError("Account created. Please log in.");
                navigate("/login");
                return;
            }

            await getMe();
            navigate("/");
        } catch {
            setError("Something went wrong")
        }
    };

    return (
        <div className='form__wrapper'>
            <h1>Register</h1>
            <form className="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="form__field">
                    <label className="form__label" htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        className="form__input"
                        autoComplete="email"
                        {...registerField('email')}
                    />
                    {errors.email && <span className="form__error">{errors.email.message}</span>}
                </div>

                <div className="form__field">
                    <label className="form__label" htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        className="form__input"
                        autoComplete="new-password"
                        {...registerField('password')}
                    />
                    {errors.password && <span className="form__error">{errors.password.message}</span>}
                </div>

                <div className="form__field">
                    <label className="form__label" htmlFor="confirmPassword">Confirm password</label>
                    <input
                        id="confirmPassword"
                        type="password"
                        className="form__input"
                        autoComplete="new-password"
                        {...registerField('confirmPassword')}
                    />
                    {errors.confirmPassword && <span className="form__error">{errors.confirmPassword.message}</span>}
                </div>

                {error && <span className="form__error">{error}</span>}

                <div className="form__footer">
                    <button
                        type="button"
                        className="btn btn--outline btn--secondary"
                        onClick={handleDemoLogin}
                        disabled={isSubmitting || demoLoading}
                    >
                        {demoLoading ? 'Logging in…' : 'Log in as demo user'}
                    </button>
                    <button type="submit" className="btn btn--primary" disabled={isSubmitting}>
                        {isSubmitting ? 'Creating account…' : 'Create account'}
                    </button>
                </div>
            </form>
        </div>
    );
}
