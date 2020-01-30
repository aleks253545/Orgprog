import sortEx from './sorting.js';

export default class Department {
  constructor(director) {
    this.director = director;
    this.projects = [];
    this.freeProgrammers = [];
    this.workProgrammers = [];
    this.completeOnThisDay = [];
    this.layOffProgrammer = 0;
  }

  checkCompleteProject() {
    this.projects.forEach((project, index) => {
      if (project.time <= 0) {
        project.activeProgrammer.experience += 1;
        this.freeProgrammers.push(this.workProgrammers
          .splice(this.workProgrammers.indexOf(project.activeProgrammer), 1)[0]);
        if (project.helpProgrammers.length !== 0) {
          project.helpProgrammers.forEach((programer) => { programer.experience += 1; });
          this.freeProgrammers.push(...project.helpProgrammers);
          project.helpProgrammers = false;
        }
        project.activeProgrammer = false;
        this.completeOnThisDay.push(...this.projects.splice(index, 1));
      }
    });
  }

  sendDayResults() {
    return this.completeOnThisDay.splice(0, this.completeOnThisDay.length);
  }

  sendLayOffProgrammer() {
    const layOff = this.layOffProgrammer;
    this.layOffProgrammer = 0;
    return layOff;
  }
  //  upd
  // проверка на наличие выполненных проектов в конце дня

  addNewProjects(projects) {
    this.projects.push(...projects);
  }
  // добавление проектов в массив проектов отдела

  addProgrammers(programmes) {
    this.freeProgrammers.push(...programmes);
  }
  // добавление программистов

  assignProject() {
    this.projects.forEach((project) => {
      if (project.activeProgrammer === false) {
        if (!this.freeProgrammers.length) throw new Error('dep must have free devs');
        this.setActiveProgrammerOnProject(project);
        this.workProgrammers.push(this.freeProgrammers.shift());
      }
    });
  }

  setActiveProgrammerOnProject(project) {
    this.freeProgrammers[0].dayOutOfWork = 0;
    project.activeProgrammer = this.freeProgrammers[0];
  }
  // распределение программистов на проекты  todo доставать первого через
  // shift и отдельная функция для сброса дней
  // и освобождению програмера upd странно ,но сразу я не могу
  // достать шитом програмера и его уже использовать выдает ошибку

  endDay() {
    this.layoff();
    this.projects.forEach((item) => {
      item.newDayProject();
    });
    this.checkCompleteProject();
  }
  // событие нового дня

  layoff() {
    this.freeProgrammers.forEach((freeProgramer) => { freeProgramer.dayOutOfWork += 1; });
    const layoffList = this.freeProgrammers.filter((item) => item.dayOutOfWork >= 3).sort(sortEx);
    if (layoffList.length) {
      this.freeProgrammers.splice(this.freeProgrammers.indexOf(layoffList[0]), 1);
      this.layOffProgrammer += 1;
    }
  }
  // проверка на бездельников
}