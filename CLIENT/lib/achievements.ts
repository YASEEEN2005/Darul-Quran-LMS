import User from "@/models/User";
import dbConnect from "@/lib/mongoose";

export const BADGES = {
  FIRST_STEP: {
    title: "First Step",
    icon: "🌱",
    description: "Completed your first lesson.",
    points: 50
  },
  KNOWLEDGE_SEEKER: {
    title: "Knowledge Seeker",
    icon: "📚",
    description: "Completed 5 lessons.",
    points: 150
  },
  ASCENDANT_LEARNER: {
    title: "Ascendant Learner",
    icon: "🎓",
    description: "Completed a full course.",
    points: 500
  },
  PERFECT_INSIGHT: {
    title: "Perfect Insight",
    icon: "🎯",
    description: "Achieved 100% on an assessment.",
    points: 200
  },
  PHASE_MASTER: {
    title: "Phase Master",
    icon: "⚡",
    description: "Completed 3 assessments with >80% score.",
    points: 400
  }
};

export async function addPoints(userId: string, amount: number) {
  await dbConnect();
  await User.findByIdAndUpdate(userId, { $inc: { points: amount } });
}

export async function awardAchievement(userId: string, badgeKey: keyof typeof BADGES) {
  await dbConnect();
  const badge = BADGES[badgeKey];
  
  const user = await User.findById(userId);
  if (!user) return;

  // Check if already awarded
  const alreadyHas = user.achievements.some((a: any) => a.title === badge.title);
  if (alreadyHas) return;

  await User.findByIdAndUpdate(userId, {
    $push: { 
      achievements: { 
        title: badge.title, 
        icon: badge.icon, 
        description: badge.description,
        awardedAt: new Date()
      } 
    },
    $inc: { points: badge.points }
  });

  return badge;
}

export async function checkLessonAchievements(userId: string, completedLessonsCount: number) {
  if (completedLessonsCount === 1) {
    await awardAchievement(userId, "FIRST_STEP");
  } else if (completedLessonsCount === 5) {
    await awardAchievement(userId, "KNOWLEDGE_SEEKER");
  }
}

export async function checkExamAchievements(userId: string, score: number, totalExamsPassed: number) {
  if (score === 100) {
    await awardAchievement(userId, "PERFECT_INSIGHT");
  }
  
  if (totalExamsPassed === 3) {
    await awardAchievement(userId, "PHASE_MASTER");
  }
}
