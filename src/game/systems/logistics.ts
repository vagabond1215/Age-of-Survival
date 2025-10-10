import { type GameState, type LogisticsState } from '../state';

export function getLogisticsSpeed(logistics: LogisticsState): number {
  const base = 1;
  const cartBonus = logistics.carts * 0.25;
  const packBonus = logistics.packAnimals * 0.1;
  const roadBonus = logistics.roadBonus * 0.15;
  return base + cartBonus + packBonus + roadBonus;
}

export function applyLogistics(state: GameState): GameState {
  const next: GameState = {
    ...state,
    resources: { ...state.resources },
    notifications: [...state.notifications ]
  };
  const throughput = getLogisticsSpeed(state.logistics);
  if (throughput < 1) {
    next.notifications.push('Logistics strain: transport slowed.');
  }
  return next;
}
