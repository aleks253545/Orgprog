import Programmer from './programmer.js';
import Project from './project.js';

function generationProjects() {
  let quantity = Math.floor(Math.random() * 4);
  const projects = [];
  while (quantity + 1) {
    const direction = (Math.floor(Math.random() * 2) === 1) ? 'web' : 'mobile';
    const complexity = (Math.floor(Math.random() * 3 + 1));
    projects.push(new Project(direction, complexity));
    quantity -= 1;
  }
  return projects;
}
export default class Director {
  constructor(mobile, web, QA) {
    this.mobile = mobile;
    this.web = web;
    this.QA = QA;
    this.webProjects = [];
    this.mobileProject = [];
    this.QAProjects = [];
    this.completeProject = 0;
    this.layOffProgrammer = 0;
    this.recruitProgrammer = 0;
  }

  firstDay() {
    this.addNewProjects(generationProjects());
  }

  newDay() {
    this.recruitProgrammers(this.mobileProject, this.mobile);
    this.recruitProgrammers(this.webProjects, this.web);
    this.recruitProgrammers(this.QAProjects, this.QA);
    this.addNewProjects(generationProjects());
    this.transferProjectTodepartment();
    this.web.assignProject();
    this.mobile.assignProject();
    this.QA.assignProject();
    this.QA.endDay();
    this.web.endDay();
    this.mobile.endDay();
    this.completeProject += this.QA.sendDayResults();
    this.QAProjects.push(...this.mobile.sendDayResults(this.QAProjects, this.layOffProgrammer));
    this.QAProjects.push(...this.web.sendDayResults(this.QAProjects, this.layOffProgrammer));
    this.layOffProgrammer += this.web.sendLayOffProgrammer();
    this.layOffProgrammer += this.mobile.sendLayOffProgrammer();
    this.layOffProgrammer += this.QA.sendLayOffProgrammer();
  }

  // запуск событий нового дня
  addNewProjects(projects) {
    projects.forEach((project) => {
      if (project.direction === 'web') this.webProjects.push(project);
      else if (project.direction === 'mobile') this.mobileProject.push(project);
    });
  }
  // получение директором проектов для компании

  transferProjectTodepartment() {
    this.web.addNewProjects(this.webProjects.splice(0, this.web.freeProgrammers.length));
    this.mobile.addNewProjects(this.mobileProject.splice(0, this.mobile.freeProgrammers.length));
    this.QA.addNewProjects(this.QAProjects.splice(0, this.QA.freeProgrammers.length));
  }
  // перередача необходимого количества проектов в отделы

  recruitProgrammers(mass, departement) {
    const programmers = [];
    let i = mass.length;
    while (i > departement.freeProgrammers.length) {
      programmers.push(new Programmer());
      i -= 1;
    }
    this.recruitProgrammer += programmers.length;
    departement.addProgrammers(programmers);
  }

  returnCompleteProject(project) {
    this.QAProjects.push(project);
  }
  // upd
}
