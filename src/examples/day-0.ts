import type {ChallengeProps} from '../schema';

// Día 0 del reto de 90 días — el trailer de la serie.
// La estructura está fija; los clips se cambian en props/day-0.json.
export const day0: ChallengeProps = {
  day: 0,
  totalDays: 90,
  dayLabel: 'DAY',
  badgeFromSeconds: 3,
  segments: [
    {durationInSeconds: 3, headline: "I'm 98 kilos. I'm 21."},
    {durationInSeconds: 2, caption: 'This is me today'},
    {durationInSeconds: 1.5, caption: 'No angle, no flexing'},
    {durationInSeconds: 3, caption: '98.4 kg'},
    {durationInSeconds: 2, caption: '5 days in the gym'},
    {durationInSeconds: 2, caption: 'Cardio Saturday and Sunday'},
    {durationInSeconds: 2, caption: 'I track everything I eat'},
    {durationInSeconds: 3, caption: "I won't hide the bad days"},
    {durationInSeconds: 2.5, caption: 'You will see all of it'},
    {durationInSeconds: 3, caption: 'Day 0 of 90'},
  ],
  outro: {
    title: "Let's see how far I can go",
    subtitle: '98 kg → 85 kg',
    stats: [
      {label: 'Gym', value: '5x'},
      {label: 'Cardio', value: '2x'},
      {label: 'Days', value: '90'},
    ],
    durationInSeconds: 4,
  },
};
