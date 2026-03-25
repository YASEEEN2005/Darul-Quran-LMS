import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import Course from "@/models/Course";
import Lesson from "@/models/Lesson";
import LessonProgress from "@/models/LessonProgress";
import Exam from "@/models/Exam";
import ExamResult from "@/models/ExamResult";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const user = getUserFromRequest(req);

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ success: false, message: "Not authorized" }, { status: 403 });
    }

    const students = await User.find({ role: "STUDENT" }).select("-password").lean();
    const allCourses = await Course.find().lean();
    const allLessons = await Lesson.find().lean();
    const allExams = await Exam.find().lean();

    const stats = await Promise.all(
      students.map(async (student: any) => {
        // Fetch specific progress for this student
        const lessonProgress = await LessonProgress.find({ userId: student._id }).lean();
        const examResults = await ExamResult.find({ userId: student._id }).lean();

        const courseProgressMap = allCourses.map((course: any) => {
          const courseLessons = allLessons.filter((l: any) => l.courseId.toString() === course._id.toString());
          const completedCourseLessons = lessonProgress.filter((p: any) => 
            courseLessons.some((l: any) => l._id.toString() === p.lessonId.toString())
          );

          const courseExams = allExams.filter((e: any) => e.courseId.toString() === course._id.toString());
          const courseExamResults = examResults.filter((r: any) => 
            courseExams.some((e: any) => e._id.toString() === r.examId.toString())
          );

          const completionPercent = courseLessons.length === 0 ? 0 : Math.round((completedCourseLessons.length / courseLessons.length) * 100);

          return {
            courseId: course._id,
            title: course.title,
            lessonsTotal: courseLessons.length,
            lessonsCompleted: completedCourseLessons.length,
            examsTotal: courseExams.length,
            examsCompleted: courseExamResults.length,
            completionPercent,
            examScores: courseExamResults.map((r: any) => ({
              examId: r.examId,
              score: r.score,
              title: (allExams.find((e: any) => e._id.toString() === r.examId.toString()) as any)?.title || "Unknown Exam"
            }))
          };
        });

        // Totals for summary
        const totalLessonsAcrossAll = allLessons.length;
        const totalCompletedLessons = lessonProgress.length;
        const totalOverallPercent = totalLessonsAcrossAll === 0 ? 0 : Math.round((totalCompletedLessons / totalLessonsAcrossAll) * 100);

        return {
          id: student._id,
          name: student.name,
          email: student.email,
          approved: student.approved,
          overallProgress: totalOverallPercent,
          courses: courseProgressMap,
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error: any) {
    console.error("Student stats API error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
