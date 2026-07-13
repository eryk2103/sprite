import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormValues } from './loginSchema';
import { useNavigate } from 'react-router';
import { useAuth } from './AuthContext';


export default function LoginForm() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });
    const { login, getMe } = useAuth();
    const [error, setError] = useState<string>("");
    const [demoLoading, setDemoLoading] = useState(false);
    const navigate = useNavigate();

    const onSubmit = async (values: LoginFormValues) => {
        try{
            const res = await login(values.email, values.password);
            if(!res.ok) {
                if(res.status === 401) {
                    setError("Invalid credentials")
                }
                else{
                    setError("Something went wrong");
                }

                return;
            }
            await getMe();
            navigate("/");
        }catch {
            setError("Something went wrong")
        }
    };

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

    return (
        <div className='form__wrapper'>
            <h1>Login</h1>
            <form className="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="form__field">
                    <label className="form__label" htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        className="form__input"
                        autoComplete="email"
                        {...register('email')}
                    />
                    {errors.email && <span className="form__error">{errors.email.message}</span>}
                </div>

                <div className="form__field">
                    <label className="form__label" htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        className="form__input"
                        autoComplete="current-password"
                        {...register('password')}
                    />
                    {errors.password && <span className="form__error">{errors.password.message}</span>}
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
                        {isSubmitting ? 'Logging in…' : 'Log in'}
                    </button>
                </div>
            </form>
        </div>
    );
}
