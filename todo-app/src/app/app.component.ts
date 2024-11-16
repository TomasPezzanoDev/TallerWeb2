import { Component, OnInit } from '@angular/core';
import { TaskService } from './task-service.service';

interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  tasks: Task[] = [];
  newTask: Partial<Task> = {};
  selectedTask: Task | null = null;  // Para almacenar la tarea seleccionada
  editTask: Task = { id: 0, title: '', description: '', completed: false };


  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.getTasks();
  }

  getTasks() {
    this.taskService.getTasks().subscribe((tasks) => (this.tasks = tasks));
  }

  addTask() {
    if (this.newTask.title) {
      this.taskService.addTask(this.newTask).subscribe((task) => {
        this.tasks.push(task);
        this.newTask = {};
      });
    }
  }

 

  toggleCompleted(task: Task) {
    // Cambiamos el estado temporalmente
    const updatedCompleted = !task.completed;
  
    // Hacemos la petición al backend para actualizar el estado
    this.taskService.updateTaskStatus(task.id, updatedCompleted).subscribe(
      () => {
        // Si la actualización es exitosa, reflejamos el cambio en el frontend
        task.completed = updatedCompleted;
      },
      (error) => {
        // Si hay un error, mostramos un mensaje y revertimos el cambio
        console.error('Error updating task status', error);
        alert('Hubo un error al actualizar el estado de la tarea.');
      }
    );
  }
  
  
  

  deleteTask(id: number) {
    this.taskService.deleteTask(id).subscribe(() => {
      this.tasks = this.tasks.filter(t => t.id !== id);
      this.selectedTask = null;
    });
  }

  onSelect(task: Task): void {
    if (this.selectedTask === task) {
      this.selectedTask = null;
    } else {
      this.selectedTask = task;
    }
  }

  // Devolver el estado de completada
  getTaskStatus(task: Task): string {
    return task.completed ? 'Completed' : 'Pending';
  }

  openEditModal(task: Task): void {
    this.editTask = { ...task };
    const modal = new (window as any).bootstrap.Modal(document.getElementById('editModal')!);
    modal.show();
  }

  saveChanges(): void {
    if (this.editTask) {
      this.taskService.updateTask(this.editTask).subscribe(() => {
        // Refresca la lista completa de tareas
        this.getTasks();
        // Limpia el objeto editTask después de guardar
        this.editTask = { id: 0, title: '', description: '', completed: false };
        this.selectedTask = null;
      });
    }
  }
  
  
}
