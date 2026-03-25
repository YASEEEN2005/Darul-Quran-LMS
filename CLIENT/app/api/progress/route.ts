import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import UserProgress from "@/models/LessonProgress";
import ExamResult from "@/models/ExamResult";
import Lesson from "@/models/Lesson";
import Exam from "@/models/Exam";
import Course from "@/models/Course";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const user = getUserFromRequest(req);
    if (!user) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const courses = await Course.find().lean();
    if (courses.length === 0) return NextResponse.json({ success: true, data: null });

    const courseId = courses[0]._id; // For now, we assume the first course (OS)
    
    const [lessons, exams, progresses, results, meetings] = await Promise.all([
      Lesson.find({ courseId }).lean(),
      Exam.find({ courseId }).lean(),
      UserProgress.find({ userId: user.id }).lean(),
      ExamResult.find({ userId: user.id }).lean(),
      (await import("@/models/Meeting")).default.find().lean()
    ]);

    const completedLessonIds = progresses.filter((p: any) => p.completed).map((p: any) => p.lessonId.toString());
    const examResultsMap = results.reduce((acc: any, r: any) => {
        acc[r.examId.toString()] = r.score;
        return acc;
    }, {});

    const attendedMeetings = meetings.filter((m: any) => m.attendees?.some((a: any) => a.toString() === user.id)).length;
    const attendancePercent = meetings.length === 0 ? 100 : Math.round((attendedMeetings / meetings.length) * 100);

    const completion = lessons.length > 0 ? Math.round((completedLessonIds.length / lessons.length) * 100) : 0;
    
    // Academic Rank Logic (Phase Gating)
    let academicRank = "Gamma";
    if (completion >= 70 && Object.keys(examResultsMap).length >= 1) academicRank = "Alpha";
    else if (completion >= 30) academicRank = "Beta";

    const stats = {
        totalLessons: lessons.length,
        completedLessons: completedLessonIds.length,
        totalExams: exams.length,
        completedExams: Object.keys(examResultsMap).length,
        averageScore: results.length > 0 ? Math.round(results.reduce((acc: number, r: any) => acc + r.score, 0) / results.length) : 0,
        overallCompletion: completion,
        attendance: attendancePercent,
        rank: academicRank
    };

    return NextResponse.json({ success: true, data: stats });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
