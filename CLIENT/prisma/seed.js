const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Starting DB Seed...');

  // 1. Create Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@lms.local' },
    update: {},
    create: {
      email: 'admin@lms.local',
      name: 'System Admin',
      role: 'ADMIN',
      approved: true,
      googleId: 'google-admin-123',
    },
  });
  console.log(`Created Admin: ${admin.email}`);

  // 2. Create Students
  const studentApproved = await prisma.user.upsert({
    where: { email: 'student1@lms.local' },
    update: {},
    create: {
      email: 'student1@lms.local',
      name: 'Approved Student',
      role: 'STUDENT',
      approved: true,
      googleId: 'google-student-1',
    },
  });
  
  const studentPending = await prisma.user.upsert({
    where: { email: 'student2@lms.local' },
    update: {},
    create: {
      email: 'student2@lms.local',
      name: 'Pending Student',
      role: 'STUDENT',
      approved: false,
      googleId: 'google-student-2',
    },
  });
  console.log(`Created Students: ${studentApproved.email}, ${studentPending.email}`);

  // 3. Create Course
  const course = await prisma.course.create({
    data: {
      title: 'Fullstack Node.js Masterclass',
      description: 'Learn to build production grade applications.',
    },
  });
  console.log(`Created Course: ${course.title}`);

  // 4. Create Lessons
  const lessons = [];
  for (let i = 1; i <= 3; i++) {
    lessons.push(
      await prisma.lesson.create({
        data: {
          courseId: course.id,
          title: `Lesson ${i}: Core Concepts`,
          videoUrl: `https://example.com/video${i}.mp4`,
          orderIndex: i,
        },
      })
    );
  }
  console.log(`Created 3 Lessons`);

  // 5. Create Exams
  const exam1 = await prisma.exam.create({
    data: {
      courseId: course.id,
      title: 'Midterm Exam',
      orderIndex: 4, // Comes after Lesson 3
      questions: {
        create: [
          {
            text: 'What is Node.js?',
            options: ['A framework', 'A JS Runtime', 'A Database', 'A browser'],
            correctOptionIndex: 1,
          },
          {
            text: 'What does MVC stand for?',
            options: ['Model View Component', 'Most Valuable Coder', 'Model View Controller', 'Micro View Container'],
            correctOptionIndex: 2,
          }
        ]
      }
    }
  });

  const exam2 = await prisma.exam.create({
    data: {
      courseId: course.id,
      title: 'Final Exam',
      orderIndex: 5,
      questions: {
        create: [
          {
            text: 'Is Prisma an ORM?',
            options: ['Yes', 'No'],
            correctOptionIndex: 0,
          }
        ]
      }
    }
  });
  console.log(`Created 2 Exams`);

  console.log('Seed Complete!');
}

main()
  .catch((e) => {
    console.error('Seed Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
