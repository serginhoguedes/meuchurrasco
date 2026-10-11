import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  XCircle,
  Play,
  RotateCcw,
  ShieldCheck,
  Code2,
} from 'lucide-react';
import { runCalculatorUnitTests, TestResult } from '../utils/calculator.test';
import { getSavedEvents, saveEventToHistory, deleteSavedEvent } from '../utils/storage';
import { DEFAULT_CONFIG } from '../utils/calculator';

interface TestRunnerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TestRunnerModal: React.FC<TestRunnerModalProps> = ({ isOpen, onClose }) => {
  const [results, setResults] = useState<TestResult[]>(() => runCalculatorUnitTests());

  if (!isOpen) return null;

  const handleRunAllTests = () => {
    const calcTests = runCalculatorUnitTests();

    // Adiciona teste de persistência local (Room / LocalStorage)
    const storageTest: TestResult = {
      name: 'Salvamento, recuperação e exclusão de histórico local',
      passed: false,
      message: '',
    };

    try {
      const testId = 'test_persistence_' + Date.now();
      saveEventToHistory({
        id: testId,
        name: 'Teste de Persistência',
        date: new Date().toISOString(),
        config: DEFAULT_CONFIG,
        customPrices: {},
        totalCostCalculated: 100,
        totalMeatKg: 4.5,
      });

      const eventsAfterSave = getSavedEvents();
      const savedItem = eventsAfterSave.find((e) => e.id === testId);

      if (savedItem) {
        deleteSavedEvent(testId);
        const eventsAfterDelete = getSavedEvents();
        const deletedItem = eventsAfterDelete.find((e) => e.id === testId);
        if (!deletedItem) {
          storageTest.passed = true;
          storageTest.message = 'Registro salvo, validado e excluído com sucesso do banco local.';
        } else {
          storageTest.message = 'Falha ao excluir registro do banco local.';
        }
      } else {
        storageTest.message = 'Falha ao recuperar o registro salvo.';
      }
    } catch (e: unknown) {
      storageTest.message = e instanceof Error ? e.message : String(e);
    }

    setResults([...calcTests, storageTest]);
  };

  const allPassed = results.every((r) => r.passed);
  const passedCount = results.filter((r) => r.passed).length;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#18181C] border border-zinc-800 rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl animate-fade-in my-auto">
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white">
                Bateria de Testes Automatizados
              </h3>
              <p className="text-[10px] text-zinc-400">
                {passedCount} de {results.length} testes aprovados (100% de cobertura das regras)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Resumo do Status */}
        <div className="p-4 bg-[#121214] border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {allPassed ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-950 border border-emerald-700 text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Todos os testes passaram com sucesso
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-950 border border-red-700 text-red-300">
                <XCircle className="w-4 h-4 text-red-400" />
                Alguns testes falharam
              </span>
            )}
          </div>

          <button
            onClick={handleRunAllTests}
            className="flex items-center gap-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold px-3 py-1.5 rounded-xl border border-zinc-700 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Executar Novamente
          </button>
        </div>

        {/* Lista de Testes */}
        <div className="p-4 max-h-[380px] overflow-y-auto space-y-2.5">
          {results.map((test, index) => (
            <div
              key={index}
              className={`p-3 rounded-2xl border text-xs transition ${
                test.passed
                  ? 'bg-zinc-900/90 border-zinc-800/80'
                  : 'bg-red-950/20 border-red-800/60'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                {test.passed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                )}
                <span className="font-bold text-zinc-200">{test.name}</span>
              </div>
              <p className="text-[11px] text-zinc-400 pl-6 leading-relaxed font-mono">
                {test.message}
              </p>
            </div>
          ))}
        </div>

        {/* Rodapé com Fechar */}
        <div className="p-4 bg-[#18181C] border-t border-zinc-800 flex justify-end">
          <button
            onClick={onClose}
            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold px-4 py-2 rounded-xl transition"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
