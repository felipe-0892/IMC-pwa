import { useCallback, useEffect, useRef, useState } from 'react';
import { AboutIMC } from './components/AboutIMC';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { History } from './components/History';
import { IMCCalculator } from './components/IMCCalculator';
import { IMCResult } from './components/IMCResult';
import { IMCTable } from './components/IMCTable';
import { InstallPWA } from './components/InstallPWA';
import { MedicalNotice } from './components/MedicalNotice';
import { OnlineInformation, type InformationState } from './components/OnlineInformation';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import { useTheme } from './hooks/useTheme';
import { fetchInformation, OfflineError } from './services/informationService';
import type { IMCCategory, IMCHistory, IMCInput, IMCResult as IMCResultData } from './types/imc';
import { buildIMCResult } from './utils/imc';
import { addToHistory, clearHistory, createId, loadHistory } from './utils/storage';

interface CurrentResult {
  id: string;
  data: IMCResultData;
}

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const online = useOnlineStatus();
  const [history, setHistory] = useState<IMCHistory[]>(loadHistory);
  const [current, setCurrent] = useState<CurrentResult | null>(null);
  const [info, setInfo] = useState<InformationState>({ status: 'idle' });

  const requestRef = useRef<AbortController | null>(null);
  const resultHeadingRef = useRef<HTMLHeadingElement>(null);

  const loadInformation = useCallback(async (category: IMCCategory) => {
    requestRef.current?.abort();
    const controller = new AbortController();
    requestRef.current = controller;
    setInfo({ status: 'loading' });
    try {
      const data = await fetchInformation(category, controller.signal);
      if (!controller.signal.aborted) setInfo({ status: 'success', data });
    } catch (error) {
      if (controller.signal.aborted) return;
      setInfo({ status: 'error', offline: error instanceof OfflineError });
    }
  }, []);

  const handleCalculate = useCallback(
    (input: IMCInput) => {
      const data = buildIMCResult(input);
      const id = createId();
      setCurrent({ id, data });

      setHistory(
        addToHistory({
          id,
          date: new Date().toISOString(),
          weight: data.weight,
          height: data.height,
          imc: data.imc,
          classification: data.isMinor ? 'Sem classificação (menor de 18 anos)' : data.classification,
        }),
      );

      // Para menores de 18 anos a tabela de adultos não é usada — nem para buscar conteúdo.
      if (data.isMinor) {
        requestRef.current?.abort();
        setInfo({ status: 'idle' });
      } else {
        void loadInformation(data.category);
      }
    },
    [loadInformation],
  );

  // Leva o foco ao resultado (leitores de tela anunciam; no celular, rola até ele).
  useEffect(() => {
    if (!current) return;
    const heading = resultHeadingRef.current;
    heading?.focus({ preventScroll: true });
    const section = heading?.closest('section');
    if (!section) return;
    const { top } = section.getBoundingClientRect();
    if (top < 0 || top > window.innerHeight * 0.5) {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      section.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    }
  }, [current]);

  // Voltou a conexão depois de uma falha offline: tenta de novo sozinho.
  useEffect(() => {
    if (online && current && !current.data.isMinor && info.status === 'error' && info.offline) {
      void loadInformation(current.data.category);
    }
  }, [online, current, info, loadInformation]);

  useEffect(() => () => requestRef.current?.abort(), []);

  const handleClearHistory = useCallback(() => {
    clearHistory();
    setHistory([]);
  }, []);

  return (
    <>
      <a className="skip-link" href="#calculadora">
        Pular para a calculadora
      </a>
      <Header theme={theme} onToggleTheme={toggleTheme} />

      <main id="inicio" className="main">
        <div className="layout">
          <div className="layout__start" id="calculadora">
            <Hero />
            <IMCCalculator onCalculate={handleCalculate} />
            <InstallPWA />
          </div>

          <div className="layout__end">
            {current ? (
              <div className="results" key={current.id}>
                <IMCResult ref={resultHeadingRef} result={current.data} />
                {!current.data.isMinor ? (
                  <OnlineInformation
                    category={current.data.category}
                    state={info}
                    onRetry={() => void loadInformation(current.data.category)}
                  />
                ) : null}
                <MedicalNotice />
              </div>
            ) : (
              <div className="placeholder" aria-hidden="true">
                <p className="placeholder__value">00,00</p>
                <p className="placeholder__text">Seu resultado aparece aqui.</p>
              </div>
            )}
          </div>
        </div>

        <div className="layout layout--info">
          <IMCTable current={current && !current.data.isMinor ? current.data.category : undefined} />
          <AboutIMC />
        </div>

        <History items={history} onClear={handleClearHistory} />
      </main>

      <Footer online={online} />
    </>
  );
}
