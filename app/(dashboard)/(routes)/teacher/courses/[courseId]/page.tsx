import React from 'react'
import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { IconBadge } from '@/components/iconBadge'
import { CircleDollarSign, File, LayoutDashboard, ListChecks } from 'lucide-react'
import { TitleForm } from './_components/titleForm'
import { DescriptionForm } from './_components/descriptionForm'
import { ImageForm } from './_components/imageForm'
import { CategoryForm } from './_components/categoryForm'
import { PriceForm } from './_components/priceForm'
import { AttachmentForm } from './_components/attachmentForm'
import { ChaptersForm } from './_components/chaptersForm'
import { Banner } from '@/components/banner'
import { Actions } from './_components/actions'

const CourseIdPage = async(
    { params }: { params: { courseId: string }}
) => {
    const { userId } = await auth();
    const { courseId } = params;

    if(!userId) {
        return redirect('/');
    }

    const course = await db.course.findUnique({
        where: {
            id: courseId,
            userId
        },
        include: {
            chapters: {
                orderBy: {
                    position: 'asc',
                }
            },
            attachments: {
                orderBy: {
                    createdAt: 'desc'
                }
            }
        }
    });

    const categories = await db.category.findMany({
        orderBy: {
            name: 'asc'
        }
    });

    if(!course) {
        return redirect('/');
    }

    const requiredFields = [
        course.title,
        course.description,
        course.price,
        course.imageUrl,
        course.categoryId,
        course.chapters.some(chapter => chapter.isPublished),
    ];

    const totalFeilds = requiredFields.length;
    const completedFeilds = requiredFields.filter(Boolean).length;

    const completionText = `(${completedFeilds}/${totalFeilds})`;
    const isComplete = requiredFields.every(Boolean);

  return (
    <>
        {!course.isPublished && (
            <Banner
                label={"This course is unpublish. It will not be visible to the students."}
            />
        )}
        <div className='p-6 '>
            <div className='flex items-center justify-between'>
                <div className='flex flex-col gap-y-2'>
                    <h1 className='text-2xl font-medium'>
                        Course setup
                    </h1>
                    <span className='text-sm text-slate-700'>
                        Complete all fields {completionText}
                    </span>
                </div>
                <Actions
                    disabled={!isComplete}
                    courseId={courseId}
                    isPublished={course.isPublished}
                />
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-16'>
                <div>
                    <div className='flex items-center gap-x-2'>
                        <IconBadge icon={LayoutDashboard}/>
                        <h2 className='text-xl'>
                            Customize your course
                        </h2>
                    </div>
                    <TitleForm
                        initialData={course}
                        courseId={course.id}
                    />
                    <DescriptionForm
                        initialData={course}
                        courseId={course.id}
                    />
                    <ImageForm
                        initialData={course}
                        courseId={course.id}
                    />
                    <CategoryForm
                        initialData={course}
                        courseId={course.id}
                        options={categories.map((category) => ({
                            label: category.name,
                            value: category.id
                        }))}
                    />
                </div>
                <div className='space-y-6'>
                    <div>
                        <div className='flex items-center gap-x-2'>
                            <IconBadge icon={ListChecks}/>
                            <h2 className='text-xl'>Course Chapters</h2>
                        </div>
                        <ChaptersForm
                            initialData={course}
                            courseId={course.id}
                        />
                    </div>
                    <div>
                        <div className='flex items-center gap-x-2'>
                            <IconBadge icon={CircleDollarSign}/>
                            <h2 className='text-xl'>
                                Sell your course
                            </h2>
                        </div>
                        <PriceForm
                            initialData={course}
                            courseId={course.id}
                        />
                    </div>
                    <div>
                        <div className='flex items-center gap-x-2'>
                            <IconBadge icon={File}/>
                            <h2 className='text-xl'>
                                Resources & Attachment&apos;s
                            </h2>
                        </div>
                        <AttachmentForm
                            initialData={course}
                            courseId={course.id}
                        />
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}

export default CourseIdPage