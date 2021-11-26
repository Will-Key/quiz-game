import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataStorageService } from '../shared/data-storage.service';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.scss']
})
export class RankingComponent implements OnInit {

  //username!: string | null
  dataSorted: any
  userData: any

  constructor(
    private router: Router,
    private dataStorageService: DataStorageService
  ) { }

  ngOnInit() {
    this.userData = JSON.parse(localStorage.getItem('userData')!)

    this.dataStorageService.fetchAllQuizDone()
      .subscribe(
        async (allQuiz) => {
          await this.formatedData(allQuiz!)
          return await console.log(allQuiz)
        }
      )
  }

  makeQuiz() {
    this.router.navigate(['/start-quiz'])
  }
  private formatedData(data: any) {
    console.log(data)
    //let keys = []
    let dataInTable = []
    
    dataInTable = Object.values(data)
    console.log(dataInTable)
    this.dataSorted = dataInTable.sort(function (a:any, b:any) {
      return b.score - a.score;
    });
    console.log(this.dataSorted)
    return this.dataSorted;
    
  }

}
