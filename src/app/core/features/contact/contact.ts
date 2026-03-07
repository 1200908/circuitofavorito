import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CommonModule } from "@angular/common";
import emailjs from '@emailjs/browser';
import {ScrollRevealDirective} from '../../../shared/directives/scroll-reveal.directive';

@Component({
  selector: 'app-contact',
  imports: [FormsModule, CommonModule, ScrollRevealDirective ],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class ContactComponent {
  formData = {
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    privacy: false
  };

  isSubmitting = false;
  submitSuccess = false;
  submitError = false;

  onSubmit(form: NgForm) {if (form.valid) {
    this.isSubmitting = true;
    this.submitSuccess = false;
    this.submitError = false;

    emailjs.send(
      'service_xxxxx',
      'template_xxxx',
      this.formData,
      'xxxxxxxx'
    )
      .then(() => {
        this.isSubmitting = false;
        this.submitSuccess = true;
        form.resetForm();
      })
      .catch((error) => {
        console.error(error);
        this.isSubmitting = false;
        this.submitError = true;
      });
    }
  }

  privacyTooltipText = `

  Ao submeter este formulário, autorizas o tratamento dos teus dados pessoais (nome, email e telefone) exclusivamente para responder ao teu contacto.

  Os teus dados não serão utilizados para publicidade, promoções ou qualquer outro fim não relacionado com o mesmo.

  `.trim();

  tooltipOpen = false;

  toggleTooltip() {
    this.tooltipOpen = !this.tooltipOpen;
  }

  closeTooltip(event: Event) {
    event.stopPropagation();  // impede que o click feche outra coisa
    this.tooltipOpen = false;
  }
}
