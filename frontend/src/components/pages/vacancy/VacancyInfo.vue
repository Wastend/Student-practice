<template>
  <section class="vacancy-info">
    <div class="container">
      <div class="vacancy-info-wrap">
        <Card class="vacancy-card">
          <template #title>
            <h3 class="section-title">Подробная информация</h3>
          </template>
          <template #content>
            <div class="vacancy-info">
              <div v-if="responsibilities && responsibilities.length > 0" class="info-section">
                <h4>Обязанности</h4>
                <ul class="list">
                  <li v-for="(item, index) in responsibilities" :key="index" class="list-item">
                    {{ item.text }}
                  </li>
                </ul>
              </div>

              <div v-if="requirements && requirements.length > 0" class="info-section">
                <h4>Требования</h4>
                <ul class="list">
                  <li v-for="(item, index) in requirements" :key="index" class="list-item">
                    {{ item.text }}
                  </li>
                </ul>
              </div>

              <div class="info-section">
                <div class="info-section">
                  <h3 class="section-title">Условия</h3>
                  <div class="conditions-grid">
                    <div v-if="conditions.mentor_support" class="condition-item">
                      <i class="pi pi-user-plus"></i>
                      <span>Поддержка ментора</span>
                    </div>
                    <div v-if="conditions.certificate" class="condition-item">
                      <i class="pi pi-id-card"></i>
                      <span>Сертификат по окончании</span>
                    </div>
                    <div v-if="conditions.possibility_of_employment" class="condition-item">
                      <i class="pi pi-briefcase"></i>
                      <span>Возможность трудоустройства</span>
                    </div>
                    <div v-if="conditions.paid" class="condition-item">
                      <i class="pi pi-money-bill"></i>
                      <span>Оплачиваемая стажировка</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </Card>
      </div>
    </div>
  </section>
</template>

<script setup>
  import { Card } from "primevue";
  import 'primeicons/primeicons.css';

  defineProps({
    responsibilities: {
      type: Array,
      default: () => []
    },
    requirements: {
      type: Array,
      default: () => []
    },
    benefits: {
      type: String,
      default: ''
    },
    conditions: {
      type: Object,
      default: () => ({
        mentor_support: false,
        certificate: false,
        possibility_of_employment: false,
        paid: false
      })
    }
  });
</script>

<style scoped>
  .vacancy-info,
  .vacancy-info-wrap {
    width: 100%;
  }

  .vacancy-card {
    padding: 1.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
  }

  .section-title {
    font-size: 1.5rem;
    color: var(--text-color);
    margin-bottom: 1rem;
  }

  .info-section {
    margin-bottom: 2rem;
  }

  .info-section h4 {
    font-size: 1.2rem;
    color: var(--text-color-secondary);
    margin-bottom: 1rem;
  }

  .list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .list-item {
    position: relative;
    padding-left: 1.5rem;
    margin-bottom: 0.5rem;
    color: var(--text-color);
  }

  .list-item::before {
    content: "•";
    position: absolute;
    left: 0;
    color: var(--primary-color);
  }

  .conditions-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }

  .condition-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    background-color: var(--surface-ground);
    border-radius: 8px;
  }

  .condition-item i {
    font-size: 1.25rem;
    color: var(--primary-color);
  }

  .condition-item span {
    font-size: 0.9rem;
    color: var(--text-color);
  }
</style>