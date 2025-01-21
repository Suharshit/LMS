import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function DELETE(
    req: Request,
    { params }: { params: { courseId: string, attachmentId: string } }
) {
    try {
        const { userId } = await auth();
        if(!userId){
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const courseOwner = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId: userId,
            }
        });
        if(!courseOwner){
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const attachment = await db.attachment.delete({
            where: {
                id: params.attachmentId,
                courseId: params.courseId
            }
        })
        return NextResponse.json(attachment);
    } catch (error) {
        console.log("ATTACHMENT_ID", error);
        return new NextResponse("Error deleting attachment", { status: 500 });
    }
} 