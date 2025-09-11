import React from 'react';
import { useParams } from 'react-router-dom';

const ProjectDetail: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();

  return (
    <div>
      <h1>项目详情</h1>
      <p>项目ID: {projectId}</p>
    </div>
  );
};

export default ProjectDetail;
