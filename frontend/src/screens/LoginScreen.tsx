import React, { useState, useEffect } from 'react';
import { Input, Select, Button } from '../components';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../utils/constants';

interface LoginScreenProps {
  onSuccess: () => void;
}

const empresasOptions = [
  { value: '', label: 'Seleccionar empresa...' },
  { value: 'techcorp', label: 'TechCorp Industries' },
  { value: 'mercurio', label: 'Grupo Mercurio' },
];

const STORAGE_KEY = 'securenet_last_empresa';

export const LoginScreen: React.FC<LoginScreenProps> = ({ onSuccess }) => {
  const { login } = useAuth();
  const [empresaId, setEmpresaId] = useState('');
  const [rememberEmpresa, setRememberEmpresa] = useState(false);
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedEmpresa = localStorage.getItem(STORAGE_KEY);
    if (savedEmpresa) {
      setEmpresaId(savedEmpresa);
      setRememberEmpresa(true);
    }
  }, []);

  const handleEmpresaChange = (value: string) => {
    setEmpresaId(value);
    if (rememberEmpresa) {
      localStorage.setItem(STORAGE_KEY, value);
    }
  };

  const handleRememberToggle = () => {
    const newValue = !rememberEmpresa;
    setRememberEmpresa(newValue);
    if (newValue && empresaId) {
      localStorage.setItem(STORAGE_KEY, empresaId);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const handleLogin = async () => {
    if (!empresaId || !usuario || !password) {
      setError('Complete todos los campos');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await login({ empresaId, usuario, password });
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: COLORS.background,
        padding: 20,
      }}
    >
      <div
        style={{
          display: 'flex',
          width: '100%',
          maxWidth: 900,
          background: COLORS.gray800,
          borderRadius: 24,
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
          border: `1px solid ${COLORS.gray600}`,
        }}
      >
        <div
          style={{
            flex: 1,
            background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryLight})`,
            padding: 50,
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: 70,
              height: 70,
              background: 'white',
              borderRadius: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 25,
            }}
          >
            <i className="fas fa-shield-alt" style={{ fontSize: 36, color: COLORS.primary }} />
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 12 }}>SecureNet</h1>
          <p style={{ fontSize: 15, opacity: 0.9, lineHeight: 1.6, marginBottom: 35 }}>
            Sistema integral de control y gestión de guardias de seguridad para múltiples empresas.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { icon: 'fa-users', text: 'Gestión de equipos por zonas' },
              { icon: 'fa-comments', text: 'Comunicación en tiempo real' },
              { icon: 'fa-map-marker-alt', text: 'Ubicación GPS en vivo' },
              { icon: 'fa-chart-line', text: 'Métricas y reportes' },
            ].map((feature, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    background: 'rgba(255,255,255,0.2)',
                    borderRadius: 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <i className={`fas ${feature.icon}`} style={{ fontSize: 14 }} />
                </div>
                <span style={{ fontSize: 14 }}>{feature.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            flex: 1,
            padding: 50,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            background: COLORS.gray800,
          }}
        >
          <h2 style={{ fontSize: 26, fontWeight: 700, color: COLORS.gray50, marginBottom: 8 }}>
            Iniciar Sesión
          </h2>
          <p style={{ color: COLORS.gray400, marginBottom: 35 }}>
            Accede a tu cuenta de empresa
          </p>

          <div style={{ marginBottom: 20 }}>
            <Select
              label="Empresa"
              icon="fa-building"
              options={empresasOptions}
              value={empresaId}
              onChange={(e) => handleEmpresaChange(e.target.value)}
            />
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginTop: 8, marginLeft: 32 }}>
              <input
                type="checkbox"
                checked={rememberEmpresa}
                onChange={handleRememberToggle}
                style={{ marginRight: 8, width: 14, height: 14, accentColor: COLORS.primary }}
              />
              <span style={{ color: COLORS.gray400, fontSize: 13 }}>Recordar empresa</span>
            </label>
          </div>

          <Input
            label="Usuario"
            icon="fa-user"
            placeholder="Nombre de usuario"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
          />

          <Input
            label="Contraseña"
            icon="fa-lock"
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={error}
          />

          <Button
            onClick={handleLogin}
            loading={loading}
            icon="fa-sign-in-alt"
            style={{ marginTop: 10 }}
          >
            Iniciar Sesión
          </Button>
        </div>
      </div>
    </div>
  );
};
