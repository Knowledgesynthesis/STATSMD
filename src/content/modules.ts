import { modulesA } from './modules-a';
import { modulesB } from './modules-b';
import { modulesC } from './modules-c';
import type { Module } from './types';

export const modules: Module[] = [...modulesA, ...modulesB, ...modulesC].sort((a, b) => a.n - b.n);
export const modulesById: Record<string, Module> = Object.fromEntries(modules.map((m) => [m.id, m]));
