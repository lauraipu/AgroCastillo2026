import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './contacto.html',
  styleUrls: ['./contacto.css']
})
export class ContactoComponent {
  public nombre: string = '';
  public correo: string = '';
  public asunto: string = 'Propuesta de Alianza';
  public mensaje: string = '';

  enviarAWhatsApp(): void {
    if (!this.nombre || !this.correo || !this.mensaje) {
      alert('Por favor, completa todos los campos requeridos antes de enviar.');
      return;
    }

    const miTelefono = '573183353219';
    
    const textoMensaje = `📌 *NUEVO CONTACTO AGROCASTILLO*\n\n` +
                         `👤 *Entidad/Nombre:* ${this.nombre}\n` +
                         `📧 *Correo:* ${this.correo}\n` +
                         `💼 *Asunto:* ${this.asunto}\n\n` +
                         `📝 *Mensaje:* ${this.mensaje}`;

    const urlEncodeada = encodeURIComponent(textoMensaje);
    
    window.open(`https://api.whatsapp.com/send?phone=${miTelefono}&text=${urlEncodeada}`, '_blank');
  }
}