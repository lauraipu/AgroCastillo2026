import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-investigador-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './investigador-card.component.html',
  styleUrls: ['./investigador-card.component.css']
})
export class InvestigadorCardComponent {
  // Recibe la información del investigador desde la página padre
  @Input() investigador: any; 
}