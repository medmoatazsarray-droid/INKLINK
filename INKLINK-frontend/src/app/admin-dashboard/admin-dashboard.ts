import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Siderbar } from '../shared/siderbar/siderbar';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule, Siderbar],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css'],
})
export class AdminDashboard implements OnInit {
  adminName: string = '';
  currentDate: string = '';
  currentMonth: string = '';
  displayedMonthIndex: number = 0;
  displayedYear: number = 0;
  selectedDate: Date | null = null;
  calendarAnimDir: 'prev' | 'next' | null = null;
  calendarAnimating = false;
  private calendarAnimTimer: ReturnType<typeof setTimeout> | null = null;

  calendarWeeks: number[][] = [];
  dayNames: string[] = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  months: string[] = [
    'Janvier',
    'Février',
    'Mars',
    'Avril',
    'Mai',
    'Juin',
    'Juillet',
    'Août',
    'Septembre',
    'Octobre',
    'Novembre',
    'Décembre',
  ];

  TraiterItems: string[] = [
    '1 commande en attente de vérification : #IN-2026-047',
    '1 nouvelles commandes sans paiement : #IN-2026-048',
    "1 kit généré aujourd'hui",
  ];

  StatsCards = [];

  fluxItems = [
    { text: 'Nouveau message : Amira B.', time: 'il y a 2 min' },
    { text: 'Commande n° IN-2026-045 → "T-shirt"...', time: 'il y a 7 min' },
    { text: 'Ticket n° SUP-112 : "Retard de livraison"...', time: 'il y a 30 min' },
    { text: 'Nouvel utilisateur : Karim M. (Café El Ba...)', time: 'il y a 1 jour' },
  ];

  KitItems: string[] = [
    "Étape 1/3 : Personnalisation de l'invitation",
    'En attente de validation technique',
    'Prévu pour impression demain',
  ];

  ngOnInit(): void {
    this.adminName = localStorage.getItem('adminUsername') || 'Nom';

    const now = new Date();
    this.displayedMonthIndex = now.getMonth();
    this.displayedYear = now.getFullYear();

    this.currentDate = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1)
      .toString()
      .padStart(2, '0')}/${now.getFullYear()}`;

    this.updateCalendar();
  }

  updateCalendar(): void {
    this.currentMonth = this.months[this.displayedMonthIndex];
    const firstDayOfMonth = new Date(this.displayedYear, this.displayedMonthIndex, 1);
    this.buildCalendar(firstDayOfMonth);
  }

  prevMonth(): void {
    this.triggerCalendarAnim('prev');
    if (this.displayedMonthIndex === 0) {
      this.displayedMonthIndex = 11;
      this.displayedYear--;
    } else {
      this.displayedMonthIndex--;
    }
    this.updateCalendar();
  }

  nextMonth(): void {
    this.triggerCalendarAnim('next');
    if (this.displayedMonthIndex === 11) {
      this.displayedMonthIndex = 0;
      this.displayedYear++;
    } else {
      this.displayedMonthIndex++;
    }
    this.updateCalendar();
  }

  private triggerCalendarAnim(dir: 'prev' | 'next'): void {
    this.calendarAnimDir = dir;
    this.calendarAnimating = false;

    if (this.calendarAnimTimer) clearTimeout(this.calendarAnimTimer);

    // Let Angular remove the class first so the animation can retrigger.
    setTimeout(() => {
      this.calendarAnimating = true;
      this.calendarAnimTimer = setTimeout(() => {
        this.calendarAnimating = false;
      }, 200);
    }, 0);
  }

  selectDate(day: number): void {
    if (day !== 0) {
      this.selectedDate = new Date(this.displayedYear, this.displayedMonthIndex, day);
    }
  }

  isToday(day: number): boolean {
    if (day === 0) return false;
    const now = new Date();
    return day === now.getDate() &&
           this.displayedMonthIndex === now.getMonth() &&
           this.displayedYear === now.getFullYear();
  }

  isSelected(day: number): boolean {
    if (!this.selectedDate || day === 0) return false;
    return this.selectedDate.getDate() === day &&
           this.selectedDate.getMonth() === this.displayedMonthIndex &&
           this.selectedDate.getFullYear() === this.displayedYear;
  }

  buildCalendar(date: Date): void {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const adjustedFirst = firstDay === 0 ? 6 : firstDay - 1;

    let day = 1;
    const weeks: number[][] = [];
    let week: number[] = [];

    for (let i = 0; i < adjustedFirst; i++) week.push(0);

    while (day <= daysInMonth) {
      if (week.length === 7) {
        weeks.push(week);
        week = [];
      }
      week.push(day);
      day++;
    }

    while (week.length < 7) week.push(0);
    weeks.push(week);

    this.calendarWeeks = weeks;
  }
}

