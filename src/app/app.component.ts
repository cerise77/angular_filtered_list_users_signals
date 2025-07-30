import { RouterOutlet } from '@angular/router';
import { Component, effect, signal, computed, OnInit } from '@angular/core';
import { UsersService } from './service/user.service';
import { inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from './interface/user';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [UsersService]
})
export class AppComponent implements OnInit{
  private usersService = inject(UsersService);
  users = signal<User[]>([]);
  selectedRole = signal<'all' | 'Admin' | 'User'>('all');
  selectedUserIds = signal<Set<number>>(new Set());

  // Calculated value: Filtered users
  filteredUsers = computed(() => {
    const role = this.selectedRole();
    const ids = this.selectedUserIds();
    const allUsers = this.users();

    if (role === 'all') {
      return allUsers;
    }

    return allUsers.filter(user => user.role === role); 
  });

  // Calculated value: Selected users
  selectedUsers = computed(() => {
    const ids = this.selectedUserIds();
    return this.users().filter(user => ids.has(user.id));
  });


  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.usersService.getUsers().subscribe(users => this.users.set(users));
  }

  // Selection processing
  toggleSelection(id: number) {
      const ids = new Set(this.selectedUserIds());
      if (ids.has(id)) {
        ids.delete(id);
      } else {
        ids.add(id);
      }
      this.selectedUserIds.set(ids);
  }
}
