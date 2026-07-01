import { useLanguage } from '../context/LanguageContext';
import './LanguageToggle.css';

export default function LanguageToggle({ variant = 'default' }) {
  const { lang, setLang } = useLanguage();
  const isEn = lang === 'en';

  return (
    <div
      className={`lang-sw lang-sw--${variant}`}
      role="group"
      aria-label="Language"
    >
      {/* Sliding pill — sits behind the buttons via z-index */}
      <span
        className="lang-sw__pill"
        style={{ left: isEn ? 'calc(50% + 3px)' : '3px' }}
        aria-hidden="true"
      />

      <button
        type="button"
        className={`lang-sw__btn${!isEn ? ' lang-sw__btn--on' : ''}`}
        onClick={() => setLang('np')}
      >
        नेपाली
      </button>
      <button
        type="button"
        className={`lang-sw__btn${isEn ? ' lang-sw__btn--on' : ''}`}
        onClick={() => setLang('en')}
      >
        EN
      </button>
    </div>
  );
}
