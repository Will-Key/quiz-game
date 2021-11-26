
export class QuesAnsRespData {
  constructor (
    public question: string,
    public correct_answer: string,
    public incorrect_answers: string[]) {}
}

export class ResultModel {
  public results: QuesAnsRespData[];

  constructor(results: QuesAnsRespData[]) {
    this.results = results
  }
}
