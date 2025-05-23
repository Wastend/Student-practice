// Получение откликов для компании
export const getCompanyApplications = async () => {
  const response = await axios.get('/api/applications/company');
  return response.data;
};

// Обновление статуса отклика
export const updateApplicationStatus = async (applicationId, status) => {
  const response = await axios.patch(`/api/applications/${applicationId}/status`, { status });
  return response.data;
};

// Скачивание сопроводительного письма студента
export const downloadStudentCoverLetter = async (coverLetterId) => {
  const response = await axios.get(`/api/cover-letters/${coverLetterId}/download`, {
    responseType: 'blob'
  });
  return response.data;
}; 