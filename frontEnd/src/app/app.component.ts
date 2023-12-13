// frontend/src/app/app.component.ts
import { Component, OnInit } from '@angular/core';
import { FilesService, FileInfo, TableInfo, FileData } from './files.service';
import { HttpClientModule } from '@angular/common/http';
import {MatListModule} from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [CommonModule, HttpClientModule, MatListModule, MatCardModule, MatTableModule], // Include CommonModule here
  providers: [FilesService] // Provide FilesService here
})
export class AppComponent implements OnInit {
  files: FileInfo[] = [];
  currentFileId: string | null = null;
  
  selectedFileId: string | null = null;
  tables: TableInfo[] = [];
  displayedColumns: string[] = [];
  dataSource: any[] = [];
  tableData: any[] = []; 
  selectedFileData: FileData | null = null; 

  constructor(private filesService: FilesService) {}

  ngOnInit() {
    this.loadFiles();
  }

  loadFiles() {
    this.filesService.getAllFiles().subscribe({
      next: (response) => {
        this.files = response;
      },
      error: (err) => console.error(err),
    });
  }

  onFileSelect(fileId: string) {
    this.selectedFileId = fileId;
    this.filesService.getFileById(fileId).subscribe({
      next: (data) => {
        console.log('Data received for file:', data);
        this.tables = data.tables;
      },
      error: (err) => console.error('Error fetching file by id:', err),
    });
  }
  selectFile(fileId: string) {
    this.filesService.getFileById(fileId).subscribe({
      next: (fileData) => {
        this.selectedFileId = fileId;

        this.selectedFileData = fileData;
      },
      error: (err) => console.error(err)
    });
  }


  onTableSelect(tableId: string) {
    console.log({ tableId, selectedFileId: this.selectedFileId })

    if (this.selectedFileId) {
      this.filesService.getTableData(this.selectedFileId, tableId).subscribe({
        next: (data) => {
          this.dataSource = data;
          this.displayedColumns = Object.keys(data[0]);
        },
        error: (err) => console.error(err),
      });
    }
  }
}