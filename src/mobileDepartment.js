
import Departement from './department.js';

export default class mobiledepartment extends Departement {
  assignProject() {
    let goHelpProgrammers = [];
    super.assignProject();
    this.projects.forEach((project) => {
      goHelpProgrammers = [];
      if (!project.inDevelopment && project.complexity > 1
        && project.complexity <= this.freeProgrammers.length) {
        goHelpProgrammers.push(...this.freeProgrammers.splice(0, project.complexity - 1));
        project.helpProgrammers.push(...goHelpProgrammers);
        //  todo  ошибка разные програмеры попадают в ворк и хелп upd
        project.helpProgrammers.forEach((programmer) => { programmer.dayOutOfWork = 0; });
        project.norm = project.complexity;
      }
      project.inDevelopment = true;
    });
  }
}
