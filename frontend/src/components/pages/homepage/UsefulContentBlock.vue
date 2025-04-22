<template>
  <section class="useful">
    <div class="container">
      <div class="useful-wrap">
        <h2>Шаги для попадания на стажировку</h2>
        <Stepper value="1">
          <StepList>
            <Step value="1">Найдите подходящую вакансию</Step>
            <Step value="2">Откликнитесь и пройдите тестирование</Step>
            <Step value="3">Начните стажировку</Step>
          </StepList>
          <StepPanels>
            <StepPanel
              v-slot="{ activateCallback }"
              value="1"
              class="useful-block"
            >
              <SvgIcon name="job" />
              <p class="useful-desc">
                Определитесь с направлением, которое вам действительно
                интересно. Используйте фильтры по специальности, навыкам и типу
                занятости, чтобы найти анкету, максимально соответствующую вашим
                ожиданиям и целям.
              </p>
            </StepPanel>
            <StepPanel
              v-slot="{ activateCallback }"
              value="2"
              class="useful-block"
            >
              <SvgIcon name="form-dock" />
              <p>
                Соберите сильное резюме, добавьте портфолио, если оно
                необходимо, и отправьте отклик. Многие компании предлагают
                пройти онлайн-тесты — не пугайтесь, это ваш шанс показать
                мотивацию и уровень подготовки.
              </p>
            </StepPanel>
            <StepPanel
              v-slot="{ activateCallback }"
              value="3"
              class="useful-block"
            >
              <SvgIcon name="rocket" />
              <p>
                После успешного отклика и прохождения всех этапов отбора, вы
                получите приглашение на стажировку. Важно быть готовым к новым
                задачам, соблюдать сроки и проявлять инициативу — это поможет
                вам максимально раскрыться и получить ценный опыт.
              </p>
            </StepPanel>
          </StepPanels>
        </Stepper>
      </div>
    </div>
  </section>
</template>
<script setup>
import SvgIcon from "@/components/ui/SvgIcon.vue";
import Step from "primevue/step";
import StepList from "primevue/steplist";
import StepPanel from "primevue/steppanel";
import StepPanels from "primevue/steppanels";
import Stepper from "primevue/stepper";
</script>
<style>
.useful {
  background-image: url("@/assets/images/research.png");
  background-size: cover;
  background-repeat: no-repeat;
  backdrop-filter: grayscale(30%);
  box-shadow: 0 0 20px 5px rgba(0, 0, 0, 0.5);
  position: relative;
  padding: 40px 0;
}

.dark .useful {
  box-shadow: 0 0 20px 5px rgba(116, 116, 116, 0.5);
}

.useful::before {
  content: "";
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 2;
}

.useful-wrap {
  position: relative;
  z-index: 3;
}

.useful-wrap h2 {
  margin-bottom: 30px;
  color: #f9f9f9;
}

.useful-wrap .p-step-header .p-step-title {
  color: #f9f9f9;
}

.p-steppanel.useful-block {
  display: flex;
  flex-direction: column;
  background: rgb(92 92 92 / 50%);
  border-radius: 60px;
  align-items: center;
  padding: 40px;
  gap: 30px;
}

.useful-block p {
  font-size: 24px;
  text-align: center;
  color: #f9f9f9;
  padding: 0 40px;
}

.useful-block path {
  fill: #f9f9f9;
}
</style>
