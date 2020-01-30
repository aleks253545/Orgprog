import Director from './src/director.js';
import MobileDepartment from './src/mobileDepartment.js';
import Webdepartment from './src/webDepartment.js';
import QAdepartment from './src/QADepatment.js';


const mobile = new MobileDepartment();
const web = new Webdepartment();
const QA = new QAdepartment();
const director = new Director(mobile, web, QA);
// фукнция генерации проектов
function work(days) {
  let i = 1;
  while (i <= days) {
    if (i === 1) {
      director.firstDay();
    } else {
      director.newDay();
    }
    i += 1;
  }
  return {
    projects: director.completeProject,
    layOffProgrammer: director.layOffProgrammer,
    recruitProgrammer: director.recruitProgrammer,
  };
}
// главная функция
console.log(work(1000));
// this у директора, передача в конструктор департаментов и юз
// передача выполн проектов обратно директору и передача им их в qa
// eslint
