<template>
  <Dialog
    v-model:visible="visible"
    :header="'Отклик на вакансию ' + vacancyTitle"
    :style="{ width: '50vw' }"
    :modal="true"
  >
    <div class="apply-form">
      <div class="form-group">
        <label>Сопроводительное письмо</label>
        <div v-if="coverLetter" class="current-file">
          <div class="file-info">
            <i class="pi pi-file" style="font-size: 1.5rem; color: var(--primary-color);"></i>
            <div class="file-details">
              <p class="file-name" :title="coverLetter.name">{{ truncateFileName(coverLetter.name) }}</p>
              <small class="file-status">Загружено</small>
            </div>
          </div>
          <div class="file-actions">
            <Button 
              icon="pi pi-eye" 
              class="p-button-text" 
              @click="showPreview"
              v-tooltip.top="'Предпросмотр'"
              v-if="isPdfFile"
            />
            <Button 
              icon="pi pi-download" 
              class="p-button-text" 
              @click="downloadCoverLetter"
              v-tooltip.top="'Скачать'"
            />
            <Button 
              icon="pi pi-trash" 
              class="p-button-text p-button-danger" 
              @click="removeCoverLetter"
              v-tooltip.top="'Удалить'"
            />
          </div>
        </div>
        <div class="file-upload">
          <FileUpload
            mode="basic"
            :auto="true"
            accept=".pdf,.doc,.docx"
            :maxFileSize="1000000"
            chooseLabel="Загрузить сопроводительное письмо"
            @upload="onFileUpload"
            :customUpload="true"
            :uploadHandler="uploadFile"
            :showUploadButton="false"
            :showCancelButton="false"
            :progress="uploadProgress"
          />
          <small class="p-text-secondary">
            Поддерживаемые форматы: PDF, DOC, DOCX. Максимальный размер: 1MB
          </small>
        </div>
      </div>

      <div class="form-group">
        <label for="message">Сообщение работодателю</label>
        <Textarea
          id="message"
          v-model="message"
          rows="4"
          autoResize
          placeholder="Расскажите, почему вы хотите работать в этой компании"
        />
      </div>
    </div>

    <template #footer>
      <Button
        label="Отменить"
        icon="pi pi-times"
        class="p-button-text"
        @click="closeDialog"
      />
      <Button
        label="Отправить"
        icon="pi pi-check"
        class="p-button-primary"
        @click="handleSubmit"
        :loading="isSubmitting"
      />
    </template>
  </Dialog>

  <!-- Диалог предпросмотра PDF -->
  <Dialog
    v-model:visible="previewVisible"
    header="Предпросмотр сопроводительного письма"
    :style="{ width: '80vw', height: '80vh' }"
    :modal="true"
  >
    <div class="pdf-preview">
      <iframe
        v-if="previewUrl"
        :src="previewUrl"
        width="100%"
        height="100%"
        frameborder="0"
      ></iframe>
      <div v-else class="preview-loading">
        <ProgressSpinner />
        <p>Загрузка предпросмотра...</p>
      </div>
    </div>
  </Dialog>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { Dialog, Button, FileUpload, Textarea, ProgressSpinner } from 'primevue';
import { useToast } from 'primevue/usetoast';
import { uploadCoverLetter, deleteCoverLetter, applyToVacancy, downloadCoverLetterFile } from '@/api';

const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  vacancyId: {
    type: Number,
    required: true
  },
  vacancyTitle: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['update:visible', 'applied']);

const toast = useToast();
const message = ref('');
const coverLetter = ref(null);
const isSubmitting = ref(false);
const uploadProgress = ref(0);
const previewVisible = ref(false);
const previewUrl = ref('');

const isPdfFile = computed(() => {
  return coverLetter.value?.name?.toLowerCase().endsWith('.pdf');
});

const closeDialog = () => {
  emit('update:visible', false);
  message.value = '';
  coverLetter.value = null;
  uploadProgress.value = 0;
};

const truncateFileName = (fileName) => {
  if (fileName.length > 30) {
    const extension = fileName.split('.').pop();
    const name = fileName.substring(0, 30 - extension.length - 3);
    return `${name}...${extension}`;
  }
  return fileName;
};

onMounted(() => {
  const savedCoverLetter = localStorage.getItem('coverLetter');
  if (savedCoverLetter) {
    coverLetter.value = JSON.parse(savedCoverLetter);
  }
});

const showPreview = async () => {
  if (!isPdfFile.value) {
    toast.add({
      severity: 'warn',
      summary: 'Предупреждение',
      detail: 'Предпросмотр доступен только для PDF файлов',
      life: 3000
    });
    return;
  }

  previewVisible.value = true;
  try {
    const response = await downloadCoverLetterFile(coverLetter.value.id);
    const blob = new Blob([response], { type: 'application/pdf' });
    previewUrl.value = URL.createObjectURL(blob);
  } catch (error) {
    console.error('Ошибка при загрузке предпросмотра:', error);
    toast.add({
      severity: 'error',
      summary: 'Ошибка',
      detail: 'Не удалось загрузить предпросмотр',
      life: 3000
    });
    previewVisible.value = false;
  }
};

const onFileUpload = (event) => {
  const file = event.files[0];
  if (file) {
    // Проверка типа файла
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      toast.add({
        severity: 'error',
        summary: 'Ошибка',
        detail: 'Неподдерживаемый формат файла. Используйте PDF, DOC или DOCX',
        life: 3000
      });
      return;
    }

    // Проверка размера файла (1MB)
    if (file.size > 1000000) {
      toast.add({
        severity: 'error',
        summary: 'Ошибка',
        detail: 'Размер файла превышает 1MB',
        life: 3000
      });
      return;
    }

    uploadFile(file);
  }
};

const uploadFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    // Создаем XMLHttpRequest для отслеживания прогресса
    const xhr = new XMLHttpRequest();
    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        uploadProgress.value = Math.round((event.loaded * 100) / event.total);
      }
    });

    const response = await uploadCoverLetter(formData, xhr);
    coverLetter.value = {
      name: file.name,
      id: response.id
    };
    
    localStorage.setItem('coverLetter', JSON.stringify(coverLetter.value));
    
    toast.add({
      severity: 'success',
      summary: 'Успех',
      detail: 'Сопроводительное письмо успешно загружено',
      life: 3000
    });
  } catch (error) {
    console.error('Ошибка при загрузке файла:', error);
    toast.add({
      severity: 'error',
      summary: 'Ошибка',
      detail: error.response?.data?.message || 'Не удалось загрузить файл',
      life: 3000
    });
  } finally {
    uploadProgress.value = 0;
  }
};

const downloadCoverLetter = async () => {
  try {
    const response = await downloadCoverLetterFile(coverLetter.value.id);
    const url = window.URL.createObjectURL(new Blob([response]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', coverLetter.value.name);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error('Ошибка при скачивании файла:', error);
    toast.add({
      severity: 'error',
      summary: 'Ошибка',
      detail: error.response?.data?.message || 'Не удалось скачать файл',
      life: 3000
    });
  }
};

const removeCoverLetter = async () => {
  if (coverLetter.value?.id) {
    try {
      await deleteCoverLetter(coverLetter.value.id);
      coverLetter.value = null;
      localStorage.removeItem('coverLetter');
      toast.add({
        severity: 'success',
        summary: 'Успех',
        detail: 'Сопроводительное письмо удалено',
        life: 3000
      });
    } catch (error) {
      console.error('Ошибка при удалении файла:', error);
      toast.add({
        severity: 'error',
        summary: 'Ошибка',
        detail: error.response?.data?.message || 'Не удалось удалить файл',
        life: 3000
      });
    }
  } else {
    coverLetter.value = null;
  }
};

const handleSubmit = async () => {
  if (!coverLetter.value) {
    toast.add({
      severity: 'warn',
      summary: 'Предупреждение',
      detail: 'Пожалуйста, загрузите сопроводительное письмо',
      life: 3000
    });
    return;
  }

  isSubmitting.value = true;
  try {
    await applyToVacancy({
      vacancy_id: props.vacancyId,
      cover_letter_id: coverLetter.value.id,
      message: message.value
    });

    toast.add({
      severity: 'success',
      summary: 'Успех',
      detail: 'Отклик успешно отправлен',
      life: 3000
    });

    emit('applied');
    closeDialog();
  } catch (error) {
    console.error('Ошибка при отправке отклика:', error);
    toast.add({
      severity: 'error',
      summary: 'Ошибка',
      detail: error.response?.data?.message || 'Не удалось отправить отклик',
      life: 3000
    });
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.apply-form {
  padding: 1rem 0;
}

.form-group {
  margin-bottom: 1.5rem;
}

.current-file {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 1rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background-color: var(--surface-ground);
}

.file-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.file-details {
  display: flex;
  flex-direction: column;
}

.file-name {
  margin: 0;
  font-weight: 500;
  color: var(--text-color);
}

.file-status {
  color: var(--text-color-secondary);
}

.file-actions {
  display: flex;
  gap: 0.5rem;
}

.file-upload {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.pdf-preview {
  width: 100%;
  height: 100%;
  min-height: 500px;
}

.preview-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 1rem;
}
</style> 