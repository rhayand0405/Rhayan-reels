import type {ReelProps} from '../schema';

// Starting point / smoke test. Copy this shape for real reels and drop the
// clips into public/.
export const exampleReel: ReelProps = {
  hook: 'Nadie te dice esto sobre el primer año en el gym',
  hookDurationInSeconds: 2,
  showProgressBar: true,
  segments: [
    {durationInSeconds: 2, caption: 'Empecé pesando 95kg'},
    {durationInSeconds: 3, caption: 'Entrené 5 días por semana'},
    {durationInSeconds: 3, caption: 'Sin dieta, sin resultados'},
    {durationInSeconds: 2, caption: 'Esto fue lo que cambió'},
  ],
};
