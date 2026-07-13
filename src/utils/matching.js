export function normalizeText(value) {
  return String(value || '')
    .trim()
    .toLowerCase();
}

export function normalizeList(values = []) {
  return values
    .map((value) => normalizeText(value))
    .filter(Boolean);
}

export function calculateMatchScore(user, tutor) {
  if (!user) return 0;

  const userStrengths = normalizeList(user.areasOfStrength || []);
  const userNeeds = normalizeList(user.areasOfDevelopment || []);
  const tutorStrengths = normalizeList(tutor?.areasOfStrength || []);
  const tutorNeeds = normalizeList(tutor?.areasOfDevelopment || []);

  const tutorHelpsUser = tutorStrengths.filter((s) => userNeeds.includes(s)).length;
  const userHelpsTutor = tutorNeeds.filter((n) => userStrengths.includes(n)).length;

  if (tutorHelpsUser === 0 && userHelpsTutor === 0) {
    return 0;
  }

  const tutorHelpScore = tutorHelpsUser / Math.max(userNeeds.length, 1);
  const userHelpScore = userHelpsTutor / Math.max(tutorNeeds.length, 1);
  const weightedScore = tutorHelpScore * 0.65 + userHelpScore * 0.35;

  return Math.round(weightedScore * 100);
}
