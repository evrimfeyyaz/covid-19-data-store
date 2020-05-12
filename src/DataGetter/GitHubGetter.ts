import { DataGetter, DataGetterError } from 'DataGetter/DataGetter';

export class GitHubGetter implements DataGetter {
  private commitDataUrl =
    'https://api.github.com/repos/CSSEGISandData/COVID-19/commits?path=csse_covid_19_data%2Fcsse_covid_19_time_series&page=1&per_page=1';
  private baseUrl =
    'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/';
  private globalConfirmedUrl = `${this.baseUrl}time_series_covid19_confirmed_global.csv`;
  private globalDeathsUrl = `${this.baseUrl}time_series_covid19_deaths_global.csv`;
  private globalRecoveredUrl = `${this.baseUrl}time_series_covid19_recovered_global.csv`;
  private usConfirmedUrl = `${this.baseUrl}time_series_covid19_confirmed_US.csv`;
  private usDeathsUrl = `${this.baseUrl}time_series_covid19_deaths_US.csv`;

  private static createErrorMessage(response: Response): string {
    return `There was an error fetching the data from GitHub. Response status: ${response.status} - ${response.statusText}`;
  }

  private static async fetchData(url: string): Promise<string> {
    const rawResponse = await fetch(url);

    if (!rawResponse.ok) {
      const errorMessage = GitHubGetter.createErrorMessage(rawResponse);
      throw new DataGetterError(errorMessage);
    }

    return await rawResponse.text();
  }

  async getGlobalConfirmedData(): Promise<string> {
    return await GitHubGetter.fetchData(this.globalConfirmedUrl);
  }

  async getGlobalDeathsData(): Promise<string> {
    return await GitHubGetter.fetchData(this.globalDeathsUrl);
  }

  async getGlobalRecoveredData(): Promise<string> {
    return await GitHubGetter.fetchData(this.globalRecoveredUrl);
  }

  async getUSConfirmedData(): Promise<string> {
    return await GitHubGetter.fetchData(this.usConfirmedUrl);
  }

  async getUSDeathsData(): Promise<string> {
    return await GitHubGetter.fetchData(this.usDeathsUrl);
  }

  async getLastUpdatedAt(): Promise<Date> {
    const response = await fetch(this.commitDataUrl);

    if (!response.ok) {
      const errorMessage = GitHubGetter.createErrorMessage(response);
      throw new DataGetterError(errorMessage);
    }

    const json = await response.json();

    return new Date(json[0]['commit']['author']['date']);
  }
}