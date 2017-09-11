import { Pipe } from "@angular/core";

@Pipe({
  name: "dashboardPipe",
  pure: false
})
export class DashboardPipe {
  transform(array: any[], fields: string[]): any[] {

    array = array.filter(item => item.favorite == fields[0]);

    array.sort((a: any, b: any) => {
      if (a[fields[1]] < b[fields[1]]) {
        return -1;
      } else if (a[fields[1]] > b[fields[1]]) {
        return 1;
      } else {
        return 0;
      }
    });
    return array;
  }
}