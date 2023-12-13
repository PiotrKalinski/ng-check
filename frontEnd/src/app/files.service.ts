import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs';

export interface FileInfo {
  id: string;
  fileName: string;
}

export interface TableInfo {
  id: string;
  rows: number;
  columns: number;
  notes: string;
  title: string;
}

export interface FileData {
  id: string;
  tables: TableInfo[];
}

@Injectable({
  providedIn: 'root'
})
export class FilesService {
  private baseUrl = 'http://localhost:4000/api/v1/'; // TODO: Move to environment file

  constructor(private http: HttpClient) {}

  getAllFiles(): Observable<FileInfo[]> {
    return this.http.get<{ data: FileInfo[]  }>(`${this.baseUrl}/files`).pipe(
      map(response => response.data) // Extract the nested array
    );
  }

  getFileById(fileId: string): Observable<FileData> {
    return this.http.get<{ data: FileData  }>(`${this.baseUrl}/files/${fileId}`).pipe(
      map(response => response.data) // Extract the nested array
    );
  }
  getTableData(fileId: string, tableId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/files/${fileId}/tables/${tableId}`).pipe(
      map(response => response.data) // Extract the nested array
    );
  }

}