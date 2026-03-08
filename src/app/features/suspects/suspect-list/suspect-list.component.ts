import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSortModule } from '@angular/material/sort';
import { SuspectService } from '@core/services/suspect.service';
import { Suspect } from '@shared/interfaces';

@Component({
  selector: 'app-suspect-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatTableModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatSortModule
  ],
  templateUrl: './suspect-list.component.html',
  styleUrl: './suspect-list.component.scss'
})
export class SuspectListComponent implements OnInit {
  suspects: Suspect[] = [];
  filteredSuspects: Suspect[] = [];
  displayedColumns = ['threat', 'name', 'location', 'vehicle', 'speed', 'cases', 'status', 'actions'];

  searchTerm = '';
  selectedThreatLevel = '';

  constructor(private suspectService: SuspectService) {}

  ngOnInit() {
    this.suspectService.getAllSuspects().subscribe(suspects => {
      this.suspects = suspects;
      this.applyFilter();
    });
  }

  applyFilter() {
    const term = this.searchTerm.toLowerCase();
    this.filteredSuspects = this.suspects.filter(s => {
      const matchesSearch = !term ||
        s.name.toLowerCase().includes(term) ||
        s.vehicle.toLowerCase().includes(term) ||
        s.lastKnownLocation.toLowerCase().includes(term);

      const matchesThreat = !this.selectedThreatLevel ||
        s.threatLevel === this.selectedThreatLevel;

      return matchesSearch && matchesThreat;
    });
  }
}
