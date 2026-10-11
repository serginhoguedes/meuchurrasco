import { SavedEvent } from '../types';

const STORAGE_KEY = 'churrasco_calculado_history_v1';
const CURRENT_DRAFT_KEY = 'churrasco_calculado_current_draft';

export function getSavedEvents(): SavedEvent[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data) as SavedEvent[];
  } catch (e) {
    console.error('Erro ao ler histórico local:', e);
    return [];
  }
}

export function saveEventToHistory(event: SavedEvent): void {
  try {
    const events = getSavedEvents();
    const existingIndex = events.findIndex((e) => e.id === event.id);
    if (existingIndex >= 0) {
      events[existingIndex] = event;
    } else {
      events.unshift(event); // Mais recente no topo
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch (e) {
    console.error('Erro ao salvar evento localmente:', e);
  }
}

export function deleteSavedEvent(id: string): void {
  try {
    const events = getSavedEvents().filter((e) => e.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch (e) {
    console.error('Erro ao deletar evento localmente:', e);
  }
}

export function duplicateSavedEvent(id: string): SavedEvent | null {
  try {
    const events = getSavedEvents();
    const target = events.find((e) => e.id === id);
    if (!target) return null;

    const duplicated: SavedEvent = {
      ...target,
      id: 'event_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      name: `${target.name} (Cópia)`,
      date: new Date().toISOString(),
    };

    events.unshift(duplicated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    return duplicated;
  } catch (e) {
    console.error('Erro ao duplicar evento:', e);
    return null;
  }
}

export function saveCurrentDraft(draft: unknown): void {
  try {
    localStorage.setItem(CURRENT_DRAFT_KEY, JSON.stringify(draft));
  } catch (e) {
    console.error('Erro ao salvar rascunho:', e);
  }
}

export function getStoredDraft<T>(): T | null {
  try {
    const data = localStorage.getItem(CURRENT_DRAFT_KEY);
    return data ? (JSON.parse(data) as T) : null;
  } catch (e) {
    return null;
  }
}
