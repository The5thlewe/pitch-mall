import logoImg from '../assets/logo.png';

export default function Logo({ size = 34 }) {
  return (
    <img
      src={logoImg}
      alt="Pitch Mall"
      width={size}
      height={size}
      style={{ borderRadius: '50%', display: 'block', objectFit: 'cover' }}
    />
  );
}
