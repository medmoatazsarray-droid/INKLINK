import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Siderbar } from '../shared/siderbar/siderbar';
import { environment } from '../../environments/environment';

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
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
  ];

  TraiterItems: string[] = [];
  StatsCards = {
    totalCreators: 0,
    ordersToday: 0,
    averageRating: 8.7, // Static for now as not found in DB
    monthlyGains: 0
  };

  fluxItems: { text: string; time: string }[] = [];

  KitItems: string[] = [
    "Étape 1/3 : Personnalisation de l'invitation",
    'En attente de validation technique',
    'Prévu pour impression demain',
  ];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.adminName = localStorage.getItem('adminUsername') || 'Admin';

    const now = new Date();
    this.displayedMonthIndex = now.getMonth();
    this.displayedYear = now.getFullYear();

    this.currentDate = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1)
      .toString()
      .padStart(2, '0')}/${now.getFullYear()}`;

    this.updateCalendar();
    this.loadStats();
  }

  loadStats(): void {
    // Fetch Artists
    this.http.get<any[]>(`${environment.BACKEND_ENDPOINT}/artistes`).subscribe({
      next: (data) => {
        this.StatsCards.totalCreators = data.length;
      },
      error: (err) => console.error('Error fetching artists:', err)
    });

    // Fetch Orders
    this.http.get<any[]>(`${environment.BACKEND_ENDPOINT}/commande`).subscribe({
      next: (data) => {
        this.calculateOrderStats(data);
      },
      error: (err) => console.error('Error fetching orders:', err)
    });
  }

  private calculateOrderStats(orders: any[]): void {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let ordersToday = 0;
    let monthlyGains = 0;
    let pendingOrders: string[] = [];

    orders.forEach(order => {
      const orderDate = new Date(order.dateCommande);
      const orderDateStr = orderDate.toISOString().split('T')[0];

      // Orders today
      if (orderDateStr === todayStr) {
        ordersToday++;
      }

      // Monthly gains
      if (orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear) {
        monthlyGains += parseFloat(order.total || 0);
      }

      // Pending orders for "To Treat"
      if (order.statut === 'EN_ATTENTE') {
        pendingOrders.push(`Commande en attente : #${order.id_commande} (${order.client_nom || 'Client'})`);
      }
    });

    this.StatsCards.ordersToday = ordersToday;
    this.StatsCards.monthlyGains = monthlyGains;
    this.TraiterItems = pendingOrders.slice(0, 3);

    // Recent activity flux
    this.fluxItems = orders.slice(0, 4).map(order => {
      const diffMs = now.getTime() - new Date(order.dateCommande).getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      let timeStr = '';
      if (diffMins < 60) timeStr = `il y a ${diffMins} min`;
      else if (diffHours < 24) timeStr = `il y a ${diffHours} h`;
      else timeStr = `il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;

      return {
        text: `Commande #${order.id_commande} : ${order.client_nom} ${order.client_prenom}`,
        time: timeStr
      };
    });
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

