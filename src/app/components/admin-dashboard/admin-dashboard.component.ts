import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-admin-dashboard',
    template: `
    <div class="dashboard-container">
      <header>
        <h1>Panel de Administración</h1>
        <button (click)="logout()">Cerrar Sesión</button>
      </header>
      <main>
        <div class="placeholder-content">
          <span class="icon">🚧</span>
          <h2>En Construcción</h2>
          <p>El dashboard administrativo estará disponible en la próxima versión.</p>
        </div>
      </main>
    </div>
  `,
    styles: [`
    .dashboard-container {
      padding: 2rem;
      header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 3rem;
        
        button {
          padding: 0.5rem 1rem;
          background: #e53e3e;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
      }
      .placeholder-content {
        text-align: center;
        padding: 4rem;
        background: #f7fafc;
        border-radius: 8px;
        border: 2px dashed #cbd5e0;
        
        .icon { font-size: 3rem; display: block; margin-bottom: 1rem; }
        h2 { color: #2d3748; margin-bottom: 0.5rem; }
        p { color: #718096; }
      }
    }
  `]
})
export class AdminDashboardComponent {
    constructor(private readonly authService: AuthService) { }

    logout(): void {
        this.authService.logout();
    }
}
