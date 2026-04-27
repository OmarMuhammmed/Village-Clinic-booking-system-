import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Hospital, Lock, User, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button/Button';
import Input, { FormGroup } from '../components/Input/Input';
import s from './Login.module.css';

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true });
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!username.trim() || !password.trim()) {
      setError('يرجى إدخال اسم المستخدم وكلمة المرور');
      return;
    }
    setLoading(true);
    try {
      await login(username.trim(), password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={s.wrapper}>
      <div className={s.card}>
        <div className={s.branding}>
          <div className={s.iconCircle}>
            <Hospital size={32} />
          </div>
          <h1 className={s.title}>نظام طابور العيادة</h1>
          <p className={s.subtitle}>تسجيل دخول لوحة التحكم</p>
        </div>

        {error && (
          <div className={s.errorBanner}>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className={s.form}>
          <FormGroup label="اسم المستخدم" htmlFor="login-user">
            <div className={s.inputWrapper}>
              <User size={18} className={s.inputIcon} />
              <Input
                id="login-user"
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                className={s.inputWithIcon}
              />
            </div>
          </FormGroup>

          <FormGroup label="كلمة المرور" htmlFor="login-pass">
            <div className={s.inputWrapper}>
              <Lock size={18} className={s.inputIcon} />
              <Input
                id="login-pass"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className={s.inputWithIcon}
              />
            </div>
          </FormGroup>

          <Button type="submit" size="lg" loading={loading}>
            تسجيل الدخول
          </Button>
        </form>

        <div className={s.footer}>
          <Link to="/" className={s.backLink}>
            <ArrowRight size={14} />
            العودة للواجهة العامة
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
