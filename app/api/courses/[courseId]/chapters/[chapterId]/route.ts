import Mux from "@mux/mux-node";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const mux = new Mux({
    tokenId: process.env.MUX_TOKEN_ID!,
    tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

export async function DELETE(
    req: Request,
    { params }: { params: { courseId: string; chapterId: string }}
) {
    try {
        const { userId } = await auth();
        const { courseId, chapterId } = params;

        if(!userId){
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const ownCourse = await db.course.findUnique({
            where: {
                id: courseId,
                userId
            }
        });

        if(!ownCourse){
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const chapter = await db.chapter.findUnique({
            where: {
                id: chapterId,
                courseId: courseId,
            }
        });

        if(!chapter){
            return new NextResponse("Chapter not found", { status: 404 });
        }

        if(chapter.videoUrl){
            const exisitingMuxData = await db.muxData.findFirst({
                where: {
                    chapterId: chapterId,
                }
            });

            if(exisitingMuxData){
                await mux.video.assets.delete(exisitingMuxData.assertId);
                await db.muxData.delete({
                    where: {
                        id: exisitingMuxData.id,
                    }
                });
            }
        }

        const deleteChapter = await db.chapter.delete({
            where: {
                id: chapterId,
            }
        })

        const publishedChapterInCourse = await db.chapter.findMany({
            where: {
                courseId: courseId,
                isPublished: true,
            }
        });

        if(!publishedChapterInCourse.length) {
            await db.course.update({
                where: {
                    id: courseId,
                },
                data: {
                    isPublished: false,
                }
            })
        }

        return NextResponse.json(deleteChapter);
    } catch (error) {
        console.log("[CHAPTER DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string; chapterId: string }}
) {
    try {
        const { userId } = await auth();
        const { courseId, chapterId } = params;
        const values = await req.json();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const ownCourse = await db.course.findUnique({
            where: {
                id: courseId,
                userId: userId,
            }
        });

        if (!ownCourse) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const chapter = await db.chapter.update({
            where: {
                id: chapterId,
                courseId: courseId
            },
            data: {
                ...values,
            }
        });

        if (values.videoUrl) {
            const existingMuxData = await db.muxData.findFirst({
                where: {
                    chapterId: chapterId,
                }
            });

            try {
                if (existingMuxData) {
                    await mux.video.assets.delete(existingMuxData.assertId); // Corrected method
                    await db.muxData.delete({
                        where: {
                            id: existingMuxData.id,
                        }
                    });
                }

                const asset = await mux.video.assets.create({ // Corrected method
                    input: values.videoUrl,
                    playback_policy: ["public"],
                    test: false,
                });

                await db.muxData.create({
                    data: {
                        chapterId: chapterId,
                        assertId: asset.id,
                        playbackId: asset.playback_ids?.[0]?.id || "",
                    }
                });
            } catch (muxError) {
                console.error("[MUX_ERROR]", muxError);
                return new NextResponse("Mux API Error", { status: 500 });
            }
        }

        return NextResponse.json(chapter);

    } catch (error) {
        console.log("[CHAPTERID]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}