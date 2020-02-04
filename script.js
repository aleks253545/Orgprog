function sortEx(a, b) {
    if (a.experience > b.experience) return 1;
    if (a.experience == b.experience) return 0;
    if (a.experience < b.experience) return -1;
  }
class Director {
    firstDay(){
        this.addNewProjects(generationProjects());
    }
    constructor(mobile,web,QA){
        this.mobile=mobile;
        this.web=web;
        this.QA=QA
        this.mobileProject = [];
        this.webProjects=[];
        this.completeProject=0;
        this.layOffProgrammer=0;
        this.recruitProgrammer=0;
    }
    
    newDay(){
        this.recruitProgrammers(this.mobileProject,this.mobile);
        this.recruitProgrammers(this.webProjects,this.web);
        this.recruitProgrammers(this.QAProjects,this.QA);
        this.addNewProjects(generationProjects());
        this.transferProjectToDepartament();
        this.web.assignProject();
        this.mobile.assignProject();
        this.QA.assignProject();
        this.QA.endDay();
        this.web.endDay();
        this.mobile.endDay();
    }
    //запуск событий нового дня
    addNewProjects(projects){
        projects.forEach(project => {
        if(project.direction === 'web')
            this.webProjects.push(project);
        else if(project.direction==='mobile')
            this.mobileProject.push(project);
        });
    }
    //получение директором проектов для компании 
    transferProjectToDepartament(){
        this.web.addNewProjects(this.webProjects.splice(0,web.freeProgrammers.length));
        this.mobile.addNewProjects(this.mobileProject.splice(0,mobile.freeProgrammers.length));
        this.QA.addNewProjects(this.QAProjects.splice(0,QA.freeProgrammers.length))
    }
    //перередача необходимого количества проектов в отделы
    recruitProgrammers(mass,departement){
        let programmers=[],
        i=mass.length;
        while(i > departement.freeProgrammers.length){
            programmers.push(new Programmer);
            i--
        }
        this.recruitProgrammer+=programmers.length;
        departement.addProgrammers(programmers);
    }
    returnCompleteProject(project){
        this.QAProjects.push(project);
    }
    // upd
}
class Departement{
    projects=[];
    freeProgrammers=[];
    workProgrammers=[];
    constructor(director){
        this.director=director;
    }
    checkCompleteProject(){
        this.projects.forEach((project,index)=>{
            if(project.time <= 0){
                project.activeProgrammer.experience++;
                this.freeProgrammers.push(this.workProgrammers.splice(this.workProgrammers.indexOf(project.activeProgrammer),1)[0]);
                if(project.helpProgrammers.length!==0){
                    project.helpProgrammers.forEach(programer=>{programer.experience++});
                    this.freeProgrammers.push(...project.helpProgrammers);
                    project.helpProgrammers=false;
                }
                project.activeProgrammer=false;
                this.projects.splice(index,1);
                director.returnCompleteProject(project);
            }

        })
    }
    //  upd 
    //проверка на наличие выполненных проектов в конце дня
    addNewProjects(projects){
        this.projects.push(...projects);
    }
    //добавление проектов в массив проектов отдела
    addProgrammers(programmes){
        this.freeProgrammers.push(...programmes);
    }
    // добавление программистов
    assignProject(){
        this.projects.forEach(project=>{
            if(project.activeProgrammer==false){
                if (!this.freeProgrammers.length) throw new Error('dep must have free devs')
                this.setActiveProgrammerOnProject(project);
                this.workProgrammers.push(this.freeProgrammers.shift());
            }
        })
    }
    setActiveProgrammerOnProject(project){
        this.freeProgrammers[0].dayOutOfWork=0;
        project.activeProgrammer=this.freeProgrammers[0]; 
    }
    //распределение программистов на проекты  todo доставать первого через shift и отдельная функция для сброса дней и освобождению програмера upd странно ,но сразу я не могу достать шитом програмера и его уже использовать выдает ошибку 
    endDay(){
        this.layoff();
        this.projects.forEach(item=>{
            item.newDayProject();
        })
        this.checkCompleteProject();
    }
    // событие нового дня 
    layoff(){
        let layoffList;
        this.freeProgrammers.forEach(item=>{item.dayOutOfWork++});
        layoffList=this.freeProgrammers.filter(item=>item.dayOutOfWork>=3).sort(sortEx);
        if(layoffList.length){
            this.freeProgrammers.splice(this.freeProgrammers.indexOf(layoffList[0]),1);
            director.layOffProgrammer++;
        }
        
    }
    //проверка на бездельников
}
class mobileDepartament extends Departement{
    assignProject(){
        let goHelpProgrammers=[];
        super.assignProject();
        this.projects.forEach(project=>{
            goHelpProgrammers=[];
            if(!project.inDevelopment && 1 < project.complexity && project.complexity <= this.freeProgrammers.length){
                goHelpProgrammers.push(...this.freeProgrammers.splice(0,project.complexity-1));
                project.helpProgrammers.push(...goHelpProgrammers);
                //  todo  ошибка разные програмеры попадают в ворк и хелп upd
                project.helpProgrammers.forEach(programmer=>{programmer.dayOutOfWork=0;});
                project.norm=project.complexity;
            }
            project.inDevelopment=true;
        })
    }
    // добавленние к методу для мобильного отдела , который позволяет при наличии свободных программистов после распределения проектов отправить их на уже занятые проекты в помощь
    
}
class webDepartament extends Departement{
    
}
class QADepartament extends Departement{
    endDay(){
            this.layoff();
            this.projects.forEach(item=>{
                item.newDayProject();
            });
            director.completeProject+=this.projects.length;
            this.projects.splice(0,this.projects.length);
            this.workProgrammers.forEach(item=>{item.experience++});
            this.freeProgrammers=this.freeProgrammers.concat(this.workProgrammers);
            this.workProgrammers.splice(0,this.workProgrammers.length);
        }  
}
// отдельное собыие конца дня с удалением проектов
class Project{
    activeProgrammer=false;
    complete=false;
    norm=1;
    inDevelopment=false;
    helpProgrammers=[];
    constructor(direction,complexity){
        this.direction=direction;
        this.complexity=complexity;
        this.time=complexity+1;
    }
    newDayProject(){
        this.time-=this.norm;
    }
    // новый день для каждого проекта
    
}
class mobileProject extends Project{
    constructor(complexity){
        super(constructor)
        this.helpProgrammer=[];
        this.direction='mobile';
        this.complexity=complexity;
        this.time=complexity+1;
    }
    newDayProject(){
        this.time-=this.norm;
    }
    // новый день для каждого проекта
    
}
class MobileCreater{
    create(complexity){
        return new mobileProject(complexity);
    }
}
class WebCreater{
    create(complexity){
        return new webProject(complexity);
    }
}
class Programmer{
    constructor(){
        this.experience = 0;
        this.dayOutOfWork= 0;
    }
}
let director= new Director;
let mobile = new mobileDepartament,
web= new webDepartament,
QA= new QADepartament;


function generationProjects(){
    let quantity= Math.floor(Math.random() * 4 );
    let projects= [];
    let factiory;
    while(quantity+1){
        let direction = (Math.floor(Math.random() * 2)==1)
        complexity=(Math.floor(Math.random() * 3 + 1));
        factiory=(direction==0)? new WebCreater:new MobileCreater;
        projects.push(factiory.create(complexity)); 
        quantity--; 
    }
    return  projects;
}
// фукнция генерации проектов 
function work(days){
    let i=1 ;
    while(i<=days){
        if(i==1){
            director.firstDay();
        }else{
            director.newDay();
        }
        i++;
    }
    return {
        projects:director.completeProject,
        layOffProgrammer:director.layOffProgrammer,
        recruitProgrammer:director.recruitProgrammer
    }
}
// главная функция
console.log(work(1000));
// update  добавил фабрику для проектов ,сейчас она по большей части вообще не нужна , но это самое логичное место для ее использования, но больше она нигде по моему мнению не нужна , для других паттернов не вижу причин добавления вообще 

