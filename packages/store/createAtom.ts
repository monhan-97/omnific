import { atom } from 'jotai';
import { withImmer } from 'jotai-immer';
import type { Draft } from 'immer';
import type { WritableAtom } from 'jotai';

export type AtomDraftUpdater<T> = (draft: Draft<T>) => void;

export type AtomSetterArgs<T> = [T] | [AtomDraftUpdater<T>];

export type ImmerAtom<T> = WritableAtom<T, AtomSetterArgs<T>, void>;

export const createAtom = <T>(initialState: T): ImmerAtom<T> => {
  const baseAtom = atom(initialState);
  return withImmer(baseAtom) as ImmerAtom<T>;
};
