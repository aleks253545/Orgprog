export default class Project {
  constructor(direction, complexity) {
    this.activeProgrammer = false;
    this.complete = false;
    this.norm = 1;
    this.inDevelopment = false;
    this.helpProgrammers = [];
    this.direction = direction;
    this.complexity = complexity;
    this.time = complexity + 1;
  }

  newDayProject() {
    this.time -= this.norm;
  }

  // новый день для каждого проекта
  setActiveProgrammer(Programmer) {
    this.activeProgrammer = Programmer;
  }
  // назначение главного програмиста на проект
}
