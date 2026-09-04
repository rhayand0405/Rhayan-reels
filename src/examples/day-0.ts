import type {ChallengeProps} from '../schema';

// Día 0 del reto de 90 días. Sin footage todavía: en cuanto haya clips en
// public/, se le añade `media` a cada segment y el resto no cambia.
export const day0: ChallengeProps = {
  day: 0,
  totalDays: 90,
  dayLabel: 'DIA',
  title: 'RETO 90 DIAS',
  subtitle: 'Sin excusas. Todo grabado.',
  stats: [
    {label: 'Peso', value: '94 kg'},
    {label: 'Meta', value: '84 kg'},
    {label: 'Entrenos', value: '5/sem'},
  ],
  introDurationInSeconds: 4.5,
  segments: [
    {durationInSeconds: 2.5, caption: 'Este soy yo hoy'},
    {durationInSeconds: 2.5, caption: '94kg y sin definicion'},
    {durationInSeconds: 2.5, caption: '90 dias grabando todo'},
    {durationInSeconds: 2.5, caption: 'Dia 90 nos vemos aqui'},
  ],
};
