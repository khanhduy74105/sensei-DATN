import { getResumeById } from '@/actions/resume';
import React from 'react'
import ResumeBuilderDetailPage from '../_components/resume-detail';

interface TProps {
  params: {
    id: string;
  };
}

export default async function page(props :TProps) {
  const params = await props.params
  const resume = await getResumeById(params.id);
  return (
    <ResumeBuilderDetailPage initialData={resume!} />
  )
}