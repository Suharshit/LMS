import React from 'react'
import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { IconBadge } from '@/components/iconBadge'
import { LayoutDashboard } from 'lucide-react'
import { TitleForm } from './_components/titleForm'
import { DescriptionForm } from './_components/descriptionForm'
import { ImageForm } from './_components/imageForm'

const CourseIdPage = async({
    params
}: {
    params: { courseId: string }
}) => {
    const { userId } = await auth();
    const { courseId } = await params;

    if(!userId) {
        return redirect('/');
    }

    const course = await db.course.findUnique({
        where: {
            id: courseId
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
        course.categoryId
    ];

    const totalFeilds = requiredFields.length;
    const completedFeilds = requiredFields.filter(Boolean).length;

    const completionText = `(${completedFeilds}/${totalFeilds})`;

  return (
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
            </div>
        </div>
    </div>
  )
}

export default CourseIdPage