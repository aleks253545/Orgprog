import Department from './department.js';

export default class QAdepartment extends Department {
  constructor() {
    super();
    this.completeProject = 0;
  }

  endDay() {
    this.layoff();
    this.projects.forEach((item) => {
      item.newDayProject();
    });
    this.completeProject = this.projects.length;
    this.projects.splice(0, this.projects.length);
    this.workProgrammers.forEach((item) => { item.experience += 1; });
    this.freeProgrammers = this.freeProgrammers.concat(this.workProgrammers);
    this.workProgrammers.splice(0, this.workProgrammers.length);
  }

  sendDayResults() {
    return this.completeProject;
  }
}
