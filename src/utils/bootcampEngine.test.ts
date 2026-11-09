import test from 'node:test';
import assert from 'node:assert/strict';
import {
  RANKS,
  generateDayCurriculum,
  getChecklistTasksForDay,
  createDefaultDayProgress,
  calculateDayXp,
  calculateDayStudyHours,
  isEveningEntertainmentUnlocked,
  isStudyDayComplete,
  calculateBootcampMetrics,
} from './bootcampEngine';

test('60-day curriculum engine generates distinct phases for Days 1..60', () => {
  const day1 = generateDayCurriculum(1);
  assert.equal(day1.phaseNumber, 1);
  assert.equal(day1.rank.id, 1);
  assert.equal(day1.immersionTarget.recommendedPodcastLevel, 'A1');

  const day12 = generateDayCurriculum(12);
  assert.equal(day12.phaseNumber, 1);
  assert.equal(day12.rank.id, 2);
  assert.equal(day12.immersionTarget.recommendedPodcastLevel, 'A2');

  const day20 = generateDayCurriculum(20);
  assert.equal(day20.phaseNumber, 2);
  assert.equal(day20.rank.id, 3);
  assert.equal(day20.immersionTarget.recommendedPodcastLevel, 'B1');

  const day35 = generateDayCurriculum(35);
  assert.equal(day35.phaseNumber, 3);
  assert.equal(day35.rank.id, 4);
  assert.ok(day35.lesenTarget.modeFlags.some((f) => f.includes('Shuffle')));
  assert.ok(day35.lesenTarget.modeFlags.some((f) => f.includes('المعدل 1 & 2')));

  const day58 = generateDayCurriculum(58);
  assert.equal(day58.phaseNumber, 4);
  assert.equal(day58.rank.id, 7);
  assert.equal(RANKS.length, 7);
});

test('daily checklist tasks total 12 study hours (8h core + 4h immersion) and correct XP', () => {
  const mission = generateDayCurriculum(1);
  const tasks = getChecklistTasksForDay(mission);
  assert.equal(tasks.length, 13);

  const coreHours = tasks
    .filter((t) => t.section === 'core')
    .reduce((sum, t) => sum + t.studyHours, 0);
  const immHours = tasks
    .filter((t) => t.section === 'immersion')
    .reduce((sum, t) => sum + t.studyHours, 0);

  assert.equal(coreHours, 8);
  assert.equal(immHours, 4);
});

test('evening entertainment privilege unlocks when morning and afternoon blocks (core_1, core_2, core_3) are completed', () => {
  const progress = createDefaultDayProgress(1);
  assert.equal(isEveningEntertainmentUnlocked(progress), false);

  progress.completedTasks['core_1'] = true;
  progress.completedTasks['core_2'] = true;
  assert.equal(isEveningEntertainmentUnlocked(progress), false);

  progress.completedTasks['core_3'] = true;
  assert.equal(isEveningEntertainmentUnlocked(progress), true);
});

test('completing a 12-hour study day grants +1000 XP bonus and increments study hours to 12', () => {
  const progress = createDefaultDayProgress(1);
  progress.completedTasks = {
    core_1: true,
    core_2: true,
    core_3: true,
    core_4: true,
    imm_1: true,
    imm_2: true,
    imm_3: true,
    imm_4: true,
  };

  assert.equal(isStudyDayComplete(progress), true);
  assert.equal(calculateDayStudyHours(progress), 12);
  // 4 * 200 (800) + 4 * 100 (400) + 1000 bonus = 2200 XP
  assert.equal(calculateDayXp(progress), 2200);
});

test('completing 6 consecutive study days unlocks the Weekly Crown and updates streak', () => {
  const days: Record<number, ReturnType<typeof createDefaultDayProgress>> = {};
  for (let d = 1; d <= 6; d++) {
    const dp = createDefaultDayProgress(d);
    dp.completedTasks = {
      core_1: true,
      core_2: true,
      core_3: true,
      core_4: true,
      imm_1: true,
      imm_2: true,
      imm_3: true,
      imm_4: true,
    };
    days[d] = dp;
  }

  const metrics = calculateBootcampMetrics(days, 6, 3);
  assert.equal(metrics.completedStudyDaysCount, 6);
  assert.equal(metrics.totalStudyHours, 72);
  assert.equal(metrics.longestStreak, 6);
  assert.equal(metrics.weeklyCrownUnlocked, true);
  assert.ok(metrics.muendlichConfidencePercent > 0);
});
